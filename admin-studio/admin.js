/**
 * DotaMod Studio — Core Application Logic
 * Auto-monitoring, GitHub crawler, catalog editor, and deployment engine.
 */

let allCatalogMods = [];
let discoveredGitHubMods = [];
let incomingFilesList = [];
let currentHubPath = '';
let currentDistPath = '';
let autoCheckTimer = null;

// Category titles dictionary
const CATEGORY_NAMES = {
  'sets': 'Сеты & Скины',
  'hero-items': 'Оружие & Предметы',
  'herofx': 'FX Эффекты',
  'hero-sounds': 'Озвучка & Звуки',
  'backgrounds': 'Фоны меню',
  'terrains': 'Ландшафты',
  'shaders': 'Шейдеры',
  'fonts': 'Шрифты',
  'mega-kill': 'Серии убийств',
  'high-five': 'Дай пять',
  'attack-fx': 'Эффекты атаки',
  'couriers': 'Курьеры',
  'wards': 'Варды',
  'creeps': 'Крипы',
  'river': 'Река',
  'trees': 'Деревья',
  'versus-screens': 'Экраны Versus'
};

document.addEventListener('DOMContentLoaded', async () => {
  initDragAndDrop();
  loadSavedSettings();

  if (window.adminAPI) {
    try {
      const paths = await window.adminAPI.getAppPaths();
      currentHubPath = localStorage.getItem('dotamod_studio_hub_path') || paths.hubPath;
      currentDistPath = paths.distAppPath;

      const pathLabel = document.getElementById('deployHubPath');
      if (pathLabel) pathLabel.textContent = currentHubPath;
      const settingsInput = document.getElementById('settingsHubPath');
      if (settingsInput) settingsInput.value = currentHubPath;

      await loadCatalog();
      await scanIncomingFolder();
      triggerGitHubCheck();

      // Listen for incoming folder changes via fs.watch
      if (window.adminAPI.onIncomingChanged) {
        window.adminAPI.onIncomingChanged((data) => {
          addLog(`[WATCHER] Обнаружено изменение в папке incoming_mods: ${data.filename || ''}`, 'info');
          scanIncomingFolder();
        });
      }

      // Listen for trigger check from system tray
      if (window.adminAPI.onTriggerCheck) {
        window.adminAPI.onTriggerCheck(() => {
          addLog('[TRAY] Проверка репозитория запущена из системного трея', 'info');
          triggerGitHubCheck();
        });
      }

      // Listen for tab switch from notification click
      if (window.adminAPI.onSwitchTab) {
        window.adminAPI.onSwitchTab((tab) => {
          switchTab(tab);
        });
      }
    } catch (err) {
      addLog(`[ERROR] Ошибка инициализации путей: ${err.message}`, 'error');
    }
  } else {
    addLog('[WARN] Web Mode: adminAPI не обнаружен (запуск вне Electron).', 'warning');
  }

  setupAutoInterval();
});

// Chime sound synthesizer
function playChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  } catch (e) {}
}

console.log('DotaMod Studio admin.js loaded');

// Toast notification helper
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-rose-600' : 'bg-slate-800');
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-info-circle');

  toast.className = `${bg} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-white/10 transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Logging to Dashboard Console
function addLog(text, level = 'info') {
  console.log(`[STUDIO ${level}] ${text}`);
  const container = document.getElementById('activityLogsContainer');
  if (!container) return;

  const time = new Date().toLocaleTimeString('ru-RU');
  const line = document.createElement('div');
  let colorClass = 'text-slate-300';
  if (level === 'error') colorClass = 'text-rose-400 font-bold';
  else if (level === 'warning') colorClass = 'text-amber-400';
  else if (level === 'success') colorClass = 'text-emerald-400 font-semibold';

  line.className = colorClass;
  line.textContent = `[${time}] ${text}`;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

window.clearActivityLogs = function() {
  const container = document.getElementById('activityLogsContainer');
  if (container) container.innerHTML = '';
};

// Tab Switching
window.switchTab = function(tabId) {
  const tabs = ['dashboard', 'monitor', 'catalog', 'add', 'deploy', 'settings'];
  tabs.forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) el.classList.add('hidden');
  });

  const activeSection = document.getElementById(`tab-${tabId}`);
  if (activeSection) activeSection.classList.remove('hidden');

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (tabId === 'catalog') {
    renderCatalogTable();
  }
};

// Monitor Subtabs
window.setMonitorSubtab = function(subtab) {
  const githubDiv = document.getElementById('monSubtabGithub');
  const localDiv = document.getElementById('monSubtabLocal');
  const btnGithub = document.getElementById('monTabGithubBtn');
  const btnLocal = document.getElementById('monTabLocalBtn');

  if (subtab === 'github') {
    if (githubDiv) githubDiv.classList.remove('hidden');
    if (localDiv) localDiv.classList.add('hidden');
    if (btnGithub) btnGithub.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white';
    if (btnLocal) btnLocal.className = 'px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white';
  } else {
    if (githubDiv) githubDiv.classList.add('hidden');
    if (localDiv) localDiv.classList.remove('hidden');
    if (btnGithub) btnGithub.className = 'px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white';
    if (btnLocal) btnLocal.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white';
  }
};

// ==========================================
// 1. CATALOG MANAGEMENT
// ==========================================
async function loadCatalog() {
  if (!window.adminAPI) return;
  addLog(`Загрузка каталога из ${currentHubPath}...`);

  const res = await window.adminAPI.loadCatalog(currentHubPath);
  if (res && res.success) {
    allCatalogMods = res.mods || [];
    addLog(`Каталог успешно загружен: ${allCatalogMods.length} модов`, 'success');
    updateDashboardStats();
    renderCatalogTable();
  } else {
    addLog(`Ошибка загрузки каталога: ${res ? res.message : 'Неизвестная ошибка'}`, 'error');
  }
}

function updateDashboardStats() {
  const totalEl = document.getElementById('statTotalMods');
  if (totalEl) totalEl.textContent = allCatalogMods.length;

  const headerStatus = document.getElementById('headerStatusText');
  if (headerStatus) headerStatus.textContent = `Каталог подключен: ${allCatalogMods.length} модов`;

  // Count unique heroes
  const heroes = new Set(allCatalogMods.map(m => m.hero).filter(Boolean));
  const heroesEl = document.getElementById('statTotalHeroes');
  if (heroesEl) heroesEl.textContent = heroes.size;

  // Categories count
  const cats = new Set(allCatalogMods.map(m => m.category).filter(Boolean));
  const catsEl = document.getElementById('statCategoriesCount');
  if (catsEl) catsEl.textContent = `${cats.size} категорий`;
}

window.renderCatalogTable = function(modsToRender = null) {
  const tbody = document.getElementById('catalogTableBody');
  if (!tbody) return;

  const list = modsToRender || allCatalogMods;
  const filteredCountEl = document.getElementById('catalogFilteredCount');
  const totalCountEl = document.getElementById('catalogTotalCount');
  if (filteredCountEl) filteredCountEl.textContent = list.length;
  if (totalCountEl) totalCountEl.textContent = allCatalogMods.length;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-500">
          Моды не найдены по текущему запросу или фильтру.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(m => {
    const catName = CATEGORY_NAMES[m.category] || m.category;
    const badges = [];
    if (m.has_effects) badges.push('<span class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">FX</span>');
    if (m.has_icons) badges.push('<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">Иконки</span>');
    if (m.category === 'backgrounds') badges.push('<span class="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold">Фон</span>');

    return `
      <tr class="mod-table-row border-b border-white/5">
        <td class="py-2.5 px-4">
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0">
            <img src="${m.preview}" class="w-full h-full object-cover" onerror="this.src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png'">
          </div>
        </td>
        <td class="py-2.5 px-4 font-semibold text-white">
          <div class="truncate max-w-[220px]" title="${m.title}">${m.title}</div>
          <div class="text-[10px] text-slate-500 font-mono">${m.id}</div>
        </td>
        <td class="py-2.5 px-4 text-slate-300">
          <span class="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-white/5 text-[11px] font-medium">${m.hero || 'Dota 2'}</span>
        </td>
        <td class="py-2.5 px-4 text-slate-400 font-medium">${catName}</td>
        <td class="py-2.5 px-4 text-slate-400 font-mono text-[11px]">${m.file_size || '35 MB'}</td>
        <td class="py-2.5 px-4">
          <div class="flex items-center gap-1">${badges.join('')}</div>
        </td>
        <td class="py-2.5 px-4 text-right">
          <div class="flex items-center justify-end space-x-1.5">
            <button onclick="editMod('${m.id}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition-all" title="Редактировать">
              <i class="fa-solid fa-pen text-[10px]"></i>
            </button>
            <button onclick="deleteMod('${m.id}', '${m.title.replace(/'/g, "\\'")}')" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-all" title="Удалить">
              <i class="fa-solid fa-trash text-[10px]"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.filterCatalogTable = function() {
  const query = (document.getElementById('catalogSearchInput')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('catalogCategorySelect')?.value || 'all';

  const filtered = allCatalogMods.filter(m => {
    const matchesCat = (cat === 'all') || (m.category === cat);
    if (!matchesCat) return false;

    if (!query) return true;
    const title = (m.title || '').toLowerCase();
    const hero = (m.hero || '').toLowerCase();
    const id = (m.id || '').toLowerCase();
    return title.includes(query) || hero.includes(query) || id.includes(query);
  });

  renderCatalogTable(filtered);
};

// Edit Mod Modal
window.editMod = function(modId) {
  const mod = allCatalogMods.find(m => m.id === modId);
  if (!mod) return;

  document.getElementById('editOriginalId').value = mod.id;
  document.getElementById('editModTitle').value = mod.title || '';
  document.getElementById('editModHero').value = mod.hero || '';
  document.getElementById('editModCategory').value = mod.category || 'sets';
  document.getElementById('editModSize').value = mod.file_size || '35 MB';
  document.getElementById('editModPreview').value = mod.preview || '';
  document.getElementById('editModDownloadUrl').value = mod.download_url || '';
  document.getElementById('editModEffects').checked = !!mod.has_effects;
  document.getElementById('editModIcons').checked = !!mod.has_icons;

  const modal = document.getElementById('editModModal');
  if (modal) modal.classList.remove('hidden');
};

window.closeEditModal = function() {
  const modal = document.getElementById('editModModal');
  if (modal) modal.classList.add('hidden');
};

window.commitEditMod = function() {
  const origId = document.getElementById('editOriginalId').value;
  const mod = allCatalogMods.find(m => m.id === origId);
  if (!mod) return;

  mod.title = document.getElementById('editModTitle').value.trim() || mod.title;
  mod.hero = document.getElementById('editModHero').value.trim() || mod.hero;
  mod.category = document.getElementById('editModCategory').value;
  mod.file_size = document.getElementById('editModSize').value.trim() || mod.file_size;
  mod.preview = document.getElementById('editModPreview').value.trim() || mod.preview;
  mod.download_url = document.getElementById('editModDownloadUrl').value.trim() || mod.download_url;
  mod.has_effects = document.getElementById('editModEffects').checked;
  mod.has_icons = document.getElementById('editModIcons').checked;

  closeEditModal();
  filterCatalogTable();
  showToast(`Мод «${mod.title}» обновлен`, 'success');
  addLog(`Отредактирован мод: ${mod.title} (${mod.id})`, 'info');
};

window.deleteMod = function(modId, title) {
  if (!confirm(`Вы действительно хотите удалить мод «${title}» из каталога?`)) return;

  allCatalogMods = allCatalogMods.filter(m => m.id !== modId);
  filterCatalogTable();
  updateDashboardStats();
  showToast(`Мод «${title}» удален`, 'info');
  addLog(`Удален мод: ${title} (${modId})`, 'warning');
};

window.saveAndDeployCatalog = async function() {
  if (!window.adminAPI) return;
  addLog('Сохранение каталога и синхронизация с DotaMod Hub...');

  const res = await window.adminAPI.saveCatalog({
    hubPath: currentHubPath,
    mods: allCatalogMods
  });

  if (res && res.success) {
    showToast(res.message, 'success', 4000);
    addLog(`[SUCCESS] ${res.message}`, 'success');
  } else {
    showToast(`Ошибка: ${res ? res.message : 'Не удалось сохранить'}`, 'error');
    addLog(`[ERROR] Ошибка сохранения: ${res ? res.message : ''}`, 'error');
  }
};

// ==========================================
// 2. GITHUB AUTO-CRAWLER & MONITOR
// ==========================================
window.triggerGitHubCheck = async function() {
  if (!window.adminAPI) return;
  const repo = localStorage.getItem('dotamod_studio_repo') || 'h6rd/Dota2PornFxWeb';
  const grid = document.getElementById('githubDiscoveriesGrid');
  
  if (grid) {
    grid.innerHTML = `
      <div class="col-span-full panel-card p-12 text-center text-slate-400">
        <i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-400 mb-2"></i>
        <p class="text-xs">Сканирование дерева репозитория ${repo}...</p>
      </div>
    `;
  }

  addLog(`Сканирование GitHub репозитория ${repo}...`);

  try {
    const res = await window.adminAPI.checkGitHubNewMods({
      repo,
      currentMods: allCatalogMods
    });

    if (res && res.success) {
      discoveredGitHubMods = res.candidates || [];
      addLog(`Сканирование завершено: найдено ${discoveredGitHubMods.length} новых модов`, discoveredGitHubMods.length > 0 ? 'success' : 'info');

      // Update badge
      const badge = document.getElementById('monitorBadge');
      if (badge) {
        badge.textContent = discoveredGitHubMods.length;
        badge.classList.toggle('hidden', discoveredGitHubMods.length === 0);
      }
      const subCount = document.getElementById('monSubCountGithub');
      if (subCount) subCount.textContent = discoveredGitHubMods.length;
      const statGithub = document.getElementById('statNewGithub');
      if (statGithub) statGithub.textContent = discoveredGitHubMods.length;

      const importBtn = document.getElementById('importAllBtn');
      const importBadge = document.getElementById('importCountBadge');
      if (importBtn && importBadge) {
        importBadge.textContent = discoveredGitHubMods.length;
        importBtn.classList.toggle('hidden', discoveredGitHubMods.length === 0);
      }

      renderGitHubDiscoveries();

      // If new mods discovered
      if (discoveredGitHubMods.length > 0) {
        playChime();
        if (window.adminAPI && window.adminAPI.showNotification) {
          window.adminAPI.showNotification({
            title: 'DotaMod Studio: Найдены новинки!',
            body: `В репозитории ${repo} найдено ${discoveredGitHubMods.length} новых модов. Нажмите для импорта.`
          });
        }

        // Check if Auto-Import mode is activated
        const isAutoImport = localStorage.getItem('dotamod_studio_auto_import') === 'true';
        if (isAutoImport) {
          addLog(`[AUTO-IMPORT] Обнаружено ${discoveredGitHubMods.length} новых модов. Запускается автоматический импорт и сохранение базы данных...`, 'success');
          importAllDiscoveredMods();
          await saveAndDeployCatalog();
          if (window.adminAPI && window.adminAPI.showNotification) {
            window.adminAPI.showNotification({
              title: 'DotaMod Studio: База обновлена!',
              body: `Успешно автоматически импортировано и сохранено новых модов: ${discoveredGitHubMods.length}.`
            });
          }
        }
      }
    } else {
      addLog(`Ошибка GitHub сканера: ${res ? res.message : ''}`, 'error');
      if (grid) {
        grid.innerHTML = `
          <div class="col-span-full panel-card p-8 text-center text-rose-400 text-xs">
            <i class="fa-solid fa-triangle-exclamation text-xl mb-2"></i>
            <p>${res ? res.message : 'Ошибка при обращении к GitHub API'}</p>
          </div>
        `;
      }
    }
  } catch (err) {
    addLog(`Ошибка: ${err.message}`, 'error');
  }
};

function renderGitHubDiscoveries() {
  const grid = document.getElementById('githubDiscoveriesGrid');
  if (!grid) return;

  if (discoveredGitHubMods.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full panel-card p-12 text-center text-slate-400">
        <div class="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-400 inline-flex items-center justify-center text-xl mb-3 border border-emerald-500/20">
          <i class="fa-solid fa-check"></i>
        </div>
        <h4 class="text-sm font-bold text-white mb-1">Все моды из репозитория уже добавлены!</h4>
        <p class="text-xs text-slate-400">Новых неиндексированных файлов на GitHub не обнаружено.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = discoveredGitHubMods.map((cand, idx) => {
    return `
      <div class="panel-card p-4 flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
        <div>
          <div class="relative h-40 rounded-xl overflow-hidden bg-slate-900 border border-white/5 mb-3">
            <img src="${cand.preview}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png'">
            <div class="absolute top-2 left-2 flex items-center gap-1">
              <span class="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase shadow">НОВИНКА</span>
              <span class="px-2 py-0.5 rounded-lg bg-black/75 text-slate-200 text-[10px] font-medium backdrop-blur-sm">${cand.hero}</span>
            </div>
          </div>

          <h4 class="text-sm font-bold text-white truncate" title="${cand.title}">${cand.title}</h4>
          <div class="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>Категория: <strong class="text-slate-300">${CATEGORY_NAMES[cand.category] || cand.category}</strong></span>
            <span class="font-mono text-[11px]">${cand.file_size}</span>
          </div>
          <div class="mt-1 text-[10px] text-slate-500 font-mono truncate" title="${cand.path}">${cand.path}</div>
        </div>

        <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <button onclick="importDiscoveredMod(${idx})" class="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span>Добавить в каталог</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.importDiscoveredMod = function(index) {
  const item = discoveredGitHubMods[index];
  if (!item || !item.title) return;

  const newId = (item.title || 'mod').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `mod-${Date.now()}`;

  const newMod = {
    id: item.id || newId,
    title: item.title,
    hero: item.hero || 'Dota 2',
    hero_icon: item.hero_icon || 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png',
    attribute: 'other',
    category: item.category || 'sets',
    preview: item.preview || item.hero_icon,
    download_url: item.download_url,
    author: 'Steam Workshop / Artist',
    file_size: item.file_size || '35 MB',
    has_effects: !!item.has_effects,
    has_icons: !!item.has_icons,
    media_preview: null
  };

  allCatalogMods.unshift(newMod);
  discoveredGitHubMods.splice(index, 1);

  renderGitHubDiscoveries();
  updateDashboardStats();
  showToast(`Мод «${newMod.title}» добавлен в каталог!`, 'success');
  addLog(`Импортирован мод с GitHub: ${newMod.title} (${newMod.hero})`, 'success');
};

window.importAllDiscoveredMods = function() {
  if (discoveredGitHubMods.length === 0) return;
  const count = discoveredGitHubMods.length;

  discoveredGitHubMods.forEach(item => {
    if (!item || !item.title) return;
    const newId = (item.title || 'mod').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `mod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    allCatalogMods.unshift({
      id: item.id || newId,
      title: item.title,
      hero: item.hero || 'Dota 2',
      hero_icon: item.hero_icon || 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png',
      attribute: 'other',
      category: item.category || 'sets',
      preview: item.preview || item.hero_icon,
      download_url: item.download_url,
      author: 'Steam Workshop / Artist',
      file_size: item.file_size || '35 MB',
      has_effects: !!item.has_effects,
      has_icons: !!item.has_icons,
      media_preview: null
    });
  });

  discoveredGitHubMods = [];
  renderGitHubDiscoveries();
  updateDashboardStats();
  showToast(`Успешно импортировано ${count} модов с полными названиями и превью!`, 'success');
  addLog(`Массовый импорт: добавлено ${count} модов`, 'success');
};

// ==========================================
// 3. LOCAL INCOMING FOLDER & DRAG AND DROP
// ==========================================
window.scanIncomingFolder = async function() {
  if (!window.adminAPI) return;
  const res = await window.adminAPI.scanIncomingFolder();

  if (res && res.success) {
    incomingFilesList = res.files || [];
    const countEl = document.getElementById('statLocalIncoming');
    if (countEl) countEl.textContent = incomingFilesList.length;
    const subCount = document.getElementById('monSubCountLocal');
    if (subCount) subCount.textContent = incomingFilesList.length;

    renderIncomingFilesList();
  }
};

function renderIncomingFilesList() {
  const container = document.getElementById('incomingFilesList');
  if (!container) return;

  if (incomingFilesList.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-6">В папке incoming_mods пока нет новых файлов.</p>';
    return;
  }

  container.innerHTML = incomingFilesList.map(f => `
    <div class="p-3 rounded-xl bg-[#090b10] border border-white/5 flex items-center justify-between">
      <div class="flex items-center space-x-3 truncate">
        <div class="w-8 h-8 rounded-lg bg-indigo-600/15 text-indigo-400 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-file-zipper"></i>
        </div>
        <div class="truncate">
          <h5 class="text-xs font-bold text-white truncate">${f.name}</h5>
          <span class="text-[10px] text-slate-400 font-mono">${f.sizeMb}</span>
        </div>
      </div>
      <button onclick="inspectAndAddLocalFile('${f.fullPath.replace(/\\/g, '\\\\')}')" class="px-3 py-1.5 rounded-lg btn-primary text-xs font-semibold shrink-0">
        Анализ & Добавить
      </button>
    </div>
  `).join('');
}

window.openIncomingFolder = function() {
  if (window.adminAPI) {
    window.adminAPI.getAppPaths().then(p => {
      window.adminAPI.openFolderInExplorer(p.incomingPath);
    });
  }
};

function initDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  if (!dropZone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      inspectAndAddLocalFile(files[0].path);
    }
  });
}

window.pickLocalFilesToInspect = async function() {
  if (!window.adminAPI) return;
  const filePath = await window.adminAPI.selectFile([
    { name: 'Dota 2 Mod Files', extensions: ['vpk', 'zip'] }
  ]);
  if (filePath) {
    inspectAndAddLocalFile(filePath);
  }
};

window.inspectAndAddLocalFile = async function(filePath) {
  if (!window.adminAPI || !filePath) return;
  addLog(`Анализ локального файла: ${filePath}...`);

  const res = await window.adminAPI.inspectFile(filePath);
  if (res && res.success) {
    const f = res.file;
    addLog(`Распознан: ${f.cleanBase} (Герой: ${f.detectedHero || 'Не указан'}, ${f.sizeMb})`, 'success');

    // Switch to Add Tab and pre-fill form
    switchTab('add');
    const titleInput = document.getElementById('newModTitle');
    const heroInput = document.getElementById('newModHero');
    const sizeInput = document.getElementById('newModSize');
    const idInput = document.getElementById('newModId');
    const fxCheck = document.getElementById('newModEffects');
    const iconsCheck = document.getElementById('newModIcons');

    if (titleInput) titleInput.value = f.cleanBase;
    if (heroInput) heroInput.value = f.detectedHero || 'Dota 2';
    if (sizeInput) sizeInput.value = f.sizeMb;
    if (idInput) idInput.value = f.cleanBase.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (fxCheck) fxCheck.checked = f.hasEffects;
    if (iconsCheck) iconsCheck.checked = f.hasIcons;

    updateAddPreviewCard();
    showToast(`Файл «${f.fileName}» проанализирован и загружен в форму`, 'info');
  } else {
    showToast(`Ошибка анализа: ${res ? res.message : ''}`, 'error');
  }
};

// ==========================================
// 4. ADD MOD MANUALLY LOGIC
// ==========================================
window.updateAddPreviewCard = function() {
  const title = document.getElementById('newModTitle')?.value || 'Название мода';
  const hero = document.getElementById('newModHero')?.value || 'Герой';
  const cat = document.getElementById('newModCategory')?.value || 'sets';
  const preview = document.getElementById('newModPreview')?.value || 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png';

  const previewImg = document.getElementById('addPreviewImg');
  const previewTitle = document.getElementById('addPreviewTitleText');
  const previewHero = document.getElementById('addPreviewHeroBadge');
  const previewCat = document.getElementById('addPreviewCatText');

  if (previewImg) previewImg.src = preview;
  if (previewTitle) previewTitle.textContent = title;
  if (previewHero) previewHero.textContent = hero;
  if (previewCat) previewCat.textContent = CATEGORY_NAMES[cat] || cat;
};

window.commitAddMod = function() {
  const title = document.getElementById('newModTitle')?.value.trim();
  const id = document.getElementById('newModId')?.value.trim();
  if (!title || !id) {
    showToast('Укажите название и ID мода', 'error');
    return;
  }

  const newMod = {
    id,
    title,
    hero: document.getElementById('newModHero')?.value.trim() || 'Dota 2',
    hero_icon: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png',
    attribute: 'other',
    category: document.getElementById('newModCategory')?.value || 'sets',
    preview: document.getElementById('newModPreview')?.value.trim() || 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png',
    download_url: document.getElementById('newModDownloadUrl')?.value.trim() || '',
    author: 'Steam Workshop / Artist',
    file_size: document.getElementById('newModSize')?.value.trim() || '35 MB',
    has_effects: document.getElementById('newModEffects')?.checked || false,
    has_icons: document.getElementById('newModIcons')?.checked || false,
    media_preview: null
  };

  allCatalogMods.unshift(newMod);
  updateDashboardStats();
  showToast(`Мод «${title}» добавлен в каталог! Не забудьте сохранить изменения.`, 'success');
  addLog(`В каталог добавлен новый мод: ${title} (${id})`, 'success');
  resetAddForm();
  switchTab('catalog');
};

window.resetAddForm = function() {
  ['newModId', 'newModTitle', 'newModHero', 'newModSize', 'newModDownloadUrl', 'newModPreview'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const fxCheck = document.getElementById('newModEffects');
  if (fxCheck) fxCheck.checked = false;
  const iconsCheck = document.getElementById('newModIcons');
  if (iconsCheck) iconsCheck.checked = false;
  updateAddPreviewCard();
};

// ==========================================
// 5. GITHUB REMOTE DEPLOY
// ==========================================
window.deployToGitHubRemote = async function() {
  if (!window.adminAPI) return;

  const token = document.getElementById('githubTokenInput')?.value.trim();
  const repo = document.getElementById('githubRepoInput')?.value.trim();
  const branch = document.getElementById('githubBranchInput')?.value.trim() || 'main';
  const commitMsg = document.getElementById('githubCommitMsgInput')?.value.trim() || `Update mods catalog (${allCatalogMods.length} mods)`;

  if (!token) {
    showToast('Введите Personal Access Token (PAT) от GitHub', 'error');
    return;
  }

  // Save token in localStorage
  localStorage.setItem('dotamod_studio_token', token);
  localStorage.setItem('dotamod_studio_repo', repo);

  const btn = document.getElementById('deployGithubBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Отправка коммита на GitHub...</span>';
  }

  addLog(`Публикация каталога на GitHub: ${repo} (ветка ${branch})...`);

  try {
    const res = await window.adminAPI.publishToGitHub({
      token,
      repo,
      branch,
      mods: allCatalogMods,
      commitMessage: commitMsg
    });

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }

    if (res && res.success) {
      showToast('Успешно опубликовано на GitHub!', 'success', 5000);
      addLog(`[SUCCESS] Опубликовано на GitHub: ${res.message}`, 'success');
      if (res.commitUrl) addLog(`Ссылка на коммит: ${res.commitUrl}`, 'info');
    } else {
      showToast(`Ошибка публикации: ${res ? res.message : 'Неизвестная ошибка'}`, 'error');
      addLog(`[ERROR] Ошибка GitHub: ${res ? res.message : ''}`, 'error');
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
    showToast(`Ошибка: ${err.message}`, 'error');
  }
};

// ==========================================
// 6. SETTINGS & HELPERS
// ==========================================
function loadSavedSettings() {
  const token = localStorage.getItem('dotamod_studio_token');
  const tokenInput = document.getElementById('githubTokenInput');
  if (token && tokenInput) tokenInput.value = token;

  const repo = localStorage.getItem('dotamod_studio_repo');
  const repoInput = document.getElementById('githubRepoInput');
  const repoStat = document.getElementById('statRepoName');
  if (repo) {
    if (repoInput) repoInput.value = repo;
    if (repoStat) repoStat.textContent = repo;
  }

  const interval = localStorage.getItem('dotamod_studio_interval');
  const intervalSelect = document.getElementById('settingsInterval');
  if (interval && intervalSelect) intervalSelect.value = interval;

  const autoImport = localStorage.getItem('dotamod_studio_auto_import') === 'true';
  const autoImportCheckbox = document.getElementById('settingsAutoImport');
  if (autoImportCheckbox) autoImportCheckbox.checked = autoImport;
}

window.saveAdminSettings = function() {
  const hubPath = document.getElementById('settingsHubPath')?.value.trim();
  const interval = document.getElementById('settingsInterval')?.value;
  const autoImport = document.getElementById('settingsAutoImport')?.checked || false;

  if (hubPath) {
    localStorage.setItem('dotamod_studio_hub_path', hubPath);
    currentHubPath = hubPath;
  }
  if (interval) {
    localStorage.setItem('dotamod_studio_interval', interval);
  }
  localStorage.setItem('dotamod_studio_auto_import', autoImport ? 'true' : 'false');

  setupAutoInterval();
  showToast('Настройки сохранены', 'success');
  addLog(`Настройки DotaMod Studio сохранены (Авто-импорт: ${autoImport ? 'ВКЛ' : 'ВЫКЛ'})`, 'info');
};

window.browseHubPath = async function() {
  if (!window.adminAPI) return;
  const folder = await window.adminAPI.selectDirectory(currentHubPath);
  if (folder) {
    const input = document.getElementById('settingsHubPath');
    if (input) input.value = folder;
  }
};

function setupAutoInterval() {
  if (autoCheckTimer) clearInterval(autoCheckTimer);

  const mins = parseInt(localStorage.getItem('dotamod_studio_interval') || '30', 10);
  const statusEl = document.getElementById('crawlerStatusText');

  if (mins > 0) {
    if (statusEl) statusEl.textContent = `Каждые ${mins} мин`;
    autoCheckTimer = setInterval(() => {
      addLog(`[AUTO-CRAWLER] Периодическая проверка GitHub...`);
      triggerGitHubCheck();
    }, mins * 60 * 1000);
  } else {
    if (statusEl) statusEl.textContent = 'Вручную';
  }
}
