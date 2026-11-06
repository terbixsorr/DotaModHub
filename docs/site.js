/**
 * DotaMod Hub — Showcase & Landing Page Engine
 * Features: Live Catalog Filtering, In-Browser Audio/Sound Previews,
 * Interactive Modals, VAC Architecture Explainer & GitHub API Integrations.
 */

// Featured Showcase Items for Landing Page (Fast Loading & High Impact)
const FEATURED_MODS = [
  // Arcanas & Hero Skins
  {
    id: "abaddon-fallen-king",
    title: "Abaddon: Bloody Fallen King",
    hero: "Abaddon",
    category: "arcanas",
    badge: "Arcana FX",
    rarity: "Arcana",
    author: "Community",
    preview: "assets/previews/heroes/Abaddon Bloody Fallen King.webp",
    heroIcon: "assets/heroes/abaddon.png",
    description: "Эксклюзивный образ с кроваво-алой аурой меча и переработанными анимациями Mist Coil и Borrowed Time."
  },
  {
    id: "pudge-aberrant-observer",
    title: "Pudge: Aberrant Observer Arcana",
    hero: "Pudge",
    category: "arcanas",
    badge: "Премиум",
    rarity: "Arcana",
    author: "Dota2PornFx",
    preview: "assets/previews/heroes/Aberrant Observer Pudge.webp",
    heroIcon: "assets/heroes/pudge.png",
    description: "Полная замена модели и крюка с кастомными частицами Rot, крюком-щупальцем и новыми звуками Dismember."
  },
  {
    id: "alchemist-darkbrew-enforcer",
    title: "Alchemist: Darkbrew Enforcer",
    hero: "Alchemist",
    category: "arcanas",
    badge: "Collector's Cache",
    rarity: "Mythical",
    author: "Valve",
    preview: "assets/previews/heroes/Alchemist Darkbrew Enforcer.webp",
    heroIcon: "assets/heroes/alchemist.png",
    description: "Редчайший сет с золотыми колбами, эффектами Chemical Rage и бронированным огром-гладиатором."
  },
  {
    id: "ancient-apparition-sanity",
    title: "Ancient Apparition: Sanity Despair",
    hero: "Ancient Apparition",
    category: "arcanas",
    badge: "Custom FX",
    rarity: "Immortal",
    author: "Community",
    preview: "assets/previews/heroes/Ancient Apparition Sanity.webp",
    heroIcon: "assets/heroes/ancient_apparition.png",
    description: "Кастомный ледяной вихрь и неоновый Blast с эффектом разрушения кристалла при попадании."
  },

  // Sound & Voice Mods
  {
    id: "hero-sounds-largo-serega-pirat",
    title: "Largo: Серега Пират",
    hero: "Largo",
    category: "sounds",
    badge: "Мем-звук",
    rarity: "Legendary",
    author: "Serega Pirat",
    preview: "assets/previews/hero-sounds/Dark Carnival Serega Pirat.webp",
    heroIcon: "assets/heroes/antimage.png",
    audio: "audio/hero-sounds/dire-shred.mp3",
    description: "Легендарные реплики Сереги Пирата на скиллах и насмешках. Самый популярный звуковой мод сезона."
  },
  {
    id: "sound-shadow-fiend-desire-requiem",
    title: "Shadow Fiend: Requiem (Desire)",
    hero: "Shadow Fiend",
    category: "sounds",
    badge: "Ульт XVII",
    rarity: "Immortal",
    author: "XVII Sound",
    preview: "assets/previews/heroes/Abaddon Calavera.webp",
    heroIcon: "assets/heroes/shadow_fiend.png",
    audio: "audio/hero-sounds/sf-desire-requiem.mp3",
    description: "Мощный басовый дроп и кинематографичный саундтрек при касте Requiem of Souls. Качает каждую драку."
  },
  {
    id: "sound-dili-tili-bom-pudge",
    title: "Pudge: Тили-Тили-Бом (Rot)",
    hero: "Pudge",
    category: "sounds",
    badge: "Хоррор",
    rarity: "Rare",
    author: "Community",
    preview: "assets/previews/heroes/Aberrant Observer Pudge.webp",
    heroIcon: "assets/heroes/pudge.png",
    audio: "audio/hero-sounds/pudge-dili-tili-bom.mp3",
    description: "Пугающая колыбельная вместо стандартного шипения Rot. Враги начинают паниковать ещё до хука."
  },
  {
    id: "announcer-gaben-mega-kill",
    title: "Gabe Newell Mega-Kills",
    hero: "Dota 2",
    category: "sounds",
    badge: "Официальный",
    rarity: "Immortal",
    author: "Valve",
    preview: "assets/previews/announcers/Nedotrax-Mega-Kill.webp",
    heroIcon: "assets/heroes/dota2_logo_symbol.png",
    audio: "audio/announcers/gaben.mp3",
    description: "Сам Гейб Ньюэлл комментирует ваши мультикиллы и стрики с фирменным сарказмом."
  },
  {
    id: "announcer-stariy-bog",
    title: "Старый Бог (Mega-Kill)",
    hero: "Dota 2",
    category: "sounds",
    badge: "Стример-пак",
    rarity: "Mythical",
    author: "Community",
    preview: "assets/previews/announcers/Stray228-Mega-Kill.webp",
    heroIcon: "assets/heroes/dota2_logo_symbol.png",
    audio: "audio/announcers/stariy_bog.mp3",
    description: "Эмоциональные крики и фирменные реакции Старого Бога на Rampage и падение вышек."
  },
  {
    id: "sound-axe-victory",
    title: "Axe: Announcer Pack",
    hero: "Axe",
    category: "sounds",
    badge: "Голос Valve",
    rarity: "Mythical",
    author: "Valve",
    preview: "assets/previews/heroes/Abaddon Fallen King.webp",
    heroIcon: "assets/heroes/axe.png",
    audio: "audio/announcers/axe/axe_welcome.mp3",
    description: "Брутальный комментатор Axe с оригинальными репликами из студии Valve."
  },

  // WebM Video Backgrounds
  {
    id: "bg-anime-blossom-rem",
    title: "Blossom Rem — Живое меню",
    hero: "Интерфейс",
    category: "backgrounds",
    badge: "WebM 1080p",
    rarity: "Mythical",
    author: "DotaMod Hub",
    preview: "assets/previews/backgrounds/Blossom Rem.webp",
    heroIcon: "assets/heroes/crystal_maiden.png",
    description: "Плавная анимированная сцена главного меню в 60 FPS с мягким светом и падающими лепестками сакуры."
  },
  {
    id: "bg-crownfall-ambient",
    title: "Crownfall: Vengeance Sky",
    hero: "Интерфейс",
    category: "backgrounds",
    badge: "WebM 60FPS",
    rarity: "Immortal",
    author: "Valve / Clean",
    preview: "assets/previews/backgrounds/Beneath the Seventh.webp",
    heroIcon: "assets/heroes/rubick.png",
    description: "Панорама ночного Скайраса с летящими кораблями и мерцающими рунами."
  },
  {
    id: "bg-black-minimal-dota",
    title: "Deep Void: Minimal Black",
    hero: "Оптимизация",
    category: "backgrounds",
    badge: "+30 FPS",
    rarity: "Rare",
    author: "Perf Team",
    preview: "assets/previews/backgrounds/Black Background.webp",
    heroIcon: "assets/heroes/invoker.png",
    description: "Ультралегкий минималистичный фон для максимальной частоты кадров и мгновенной загрузки матчей."
  },

  // Terrains & Landscapes
  {
    id: "terrain-autumn-weather",
    title: "Осенний ландшафт (Autumn)",
    hero: "Карта",
    category: "terrains",
    badge: "Карта",
    rarity: "Immortal",
    author: "Valve / Enhanced",
    preview: "assets/previews/terrains/Autumn.webp",
    heroIcon: "assets/heroes/treant_protector.png",
    description: "Золотые кроны деревьев, туманная река и теплый рассеянный свет по всей карте Доты."
  },
  {
    id: "terrain-dark-poly-trees",
    title: "Dark Poly + Clean Trees",
    hero: "Карта",
    category: "terrains",
    badge: "Киберспорт",
    rarity: "Immortal",
    author: "Competitive",
    preview: "assets/previews/terrains/DarkPoly+Trees.webp",
    heroIcon: "assets/heroes/treant_protector.png",
    description: "Упрощенная геометрия деревьев и контрастная сетка для идеальной видимости хайграундов и вардов."
  },
  {
    id: "terrain-crownfall-overworld",
    title: "Crownfall Overworld Map",
    hero: "Карта",
    category: "terrains",
    badge: "Событие",
    rarity: "Arcana",
    author: "Valve",
    preview: "assets/previews/terrains/Crownfall.webp",
    heroIcon: "assets/heroes/rubick.png",
    description: "Королевские мостовые, каменные горгульи и мистические фонтаны в духе акта «Павшая корона»."
  },

  // Visual Effects
  {
    id: "fx-purple-dagon",
    title: "Purple Dagon Laser Beam",
    hero: "Предметы",
    category: "effects",
    badge: "VFX",
    rarity: "Rare",
    author: "Community",
    preview: "assets/previews/item-effects/Purple Dagon.webp",
    heroIcon: "assets/heroes/dagon.png",
    description: "Электрический фиолетовый разряд молнии с ультразвуковым хлопком при использовании Дагона."
  },
  {
    id: "fx-flash-step-blink",
    title: "Flash Step: Shunjin Blink",
    hero: "Blink Dagger",
    category: "effects",
    badge: "Аниме FX",
    rarity: "Mythical",
    author: "Bleach Mod",
    preview: "assets/previews/item-effects/Flash Step Blink.webp",
    heroIcon: "assets/heroes/blink.png",
    description: "Мгновенное исчезновение с черным следом и звуком сюмпо при телепортации с Блинка."
  }
];

// Audio Player State
let currentAudio = null;
let currentPlayingId = null;

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderCatalog('all');
  initFilterTabs();
  initSearch();
  initFaqAccordion();
  fetchGitHubReleaseInfo();
  initAnimeAnimations();
});

// 1. Navigation Blur & Mobile Menu
function initNavbar() {
  const navbar = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-slate-950/80', 'backdrop-blur-xl', 'border-white/10', 'shadow-2xl');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove('bg-slate-950/80', 'backdrop-blur-xl', 'border-white/10', 'shadow-2xl');
      navbar.classList.add('bg-transparent', 'border-transparent');
    }
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// 2. Render Catalog Grid
function renderCatalog(filter = 'all', searchQuery = '') {
  const container = document.getElementById('catalogGrid');
  if (!container) return;

  const query = searchQuery.trim().toLowerCase();
  const filtered = FEATURED_MODS.filter(mod => {
    const matchesCategory = (filter === 'all' || mod.category === filter);
    const matchesSearch = !query || 
      mod.title.toLowerCase().includes(query) || 
      mod.hero.toLowerCase().includes(query) ||
      mod.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <i class="fa-solid fa-ghost text-4xl mb-3 text-slate-600"></i>
        <p class="text-base font-medium">Ничего не найдено по запросу «${searchQuery}»</p>
        <p class="text-xs text-slate-500 mt-1">Попробуйте изменить категорию или очистить строку поиска</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(mod => {
    const isPlaying = currentPlayingId === mod.id;
    const isAudio = Boolean(mod.audio);

    return `
      <div class="group relative rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col border border-white/5" data-mod-id="${mod.id}">
        <!-- Image Preview Area -->
        <div class="relative w-full h-48 bg-slate-950/70 overflow-hidden cursor-pointer" onclick="openModModal('${mod.id}')">
          <img 
            src="${mod.preview}" 
            alt="${mod.title}" 
            loading="lazy" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onerror="this.src='assets/wallpapers/radiant_dire.jpg'"
          />
          
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          <!-- Top badges -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md border border-white/10 text-indigo-300">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              ${mod.badge}
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-300 border border-white/5">
              ${mod.rarity}
            </span>
          </div>

          <!-- Hero Icon Pill -->
          <div class="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-lg">
            <img src="${mod.heroIcon || 'assets/heroes/dota2_logo_symbol.png'}" alt="${mod.hero}" class="w-5 h-5 rounded-md object-cover" onerror="this.style.display='none'">
            <span class="text-xs font-semibold text-slate-200">${mod.hero}</span>
          </div>
        </div>

        <!-- Info Area -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer" onclick="openModModal('${mod.id}')">
              ${mod.title}
            </h3>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              ${mod.description}
            </p>
          </div>

          <!-- Bottom Action Bar -->
          <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            ${isAudio ? `
              <button 
                onclick="togglePlayAudio('${mod.id}', '${mod.audio}', '${mod.title.replace(/'/g, "\\'")}')" 
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isPlaying 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20' 
                    : 'bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 border border-indigo-500/30'
                }"
              >
                ${isPlaying ? `
                  <div class="flex items-center gap-0.5 h-3">
                    <span class="w-1 bg-emerald-400 rounded-full eq-bar"></span>
                    <span class="w-1 bg-emerald-400 rounded-full eq-bar"></span>
                    <span class="w-1 bg-emerald-400 rounded-full eq-bar"></span>
                  </div>
                  <span>Пауза</span>
                ` : `
                  <i class="fa-solid fa-play text-[11px] text-indigo-400"></i>
                  <span>Слушать</span>
                `}
              </button>
            ` : `
              <button 
                onclick="openModModal('${mod.id}')"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all"
              >
                <i class="fa-solid fa-expand text-[10px] text-slate-400"></i>
                <span>Инфо</span>
              </button>
            `}

            <a 
              href="https://github.com/terbixsorr/DotaModHub/releases/latest" 
              class="text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              title="Скачать в приложении DotaMod Hub"
            >
              <span>Установить</span>
              <i class="fa-solid fa-arrow-down-long text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Audio Player Logic
function togglePlayAudio(id, file, title) {
  if (currentPlayingId === id && currentAudio) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      currentPlayingId = null;
      updateAudioBar(false);
      renderCatalog(currentFilter, document.getElementById('modSearchInput').value);
      return;
    }
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentPlayingId = id;
  currentAudio = new Audio(file);
  currentAudio.volume = 0.85;

  updateAudioBar(true, title);
  renderCatalog(currentFilter, document.getElementById('modSearchInput').value);

  currentAudio.play().catch(err => {
    console.warn('Playback error:', err);
    currentPlayingId = null;
    updateAudioBar(false);
    renderCatalog(currentFilter, document.getElementById('modSearchInput').value);
  });

  currentAudio.onended = () => {
    currentPlayingId = null;
    updateAudioBar(false);
    renderCatalog(currentFilter, document.getElementById('modSearchInput').value);
  };
}

function updateAudioBar(isPlaying, title = '') {
  const bar = document.getElementById('globalAudioBar');
  const titleEl = document.getElementById('audioBarTitle');
  if (!bar) return;

  if (isPlaying) {
    bar.classList.remove('translate-y-24', 'opacity-0');
    bar.classList.add('translate-y-0', 'opacity-100');
    if (titleEl) titleEl.textContent = title;
  } else {
    bar.classList.add('translate-y-24', 'opacity-0');
    bar.classList.remove('translate-y-0', 'opacity-100');
  }
}

// 4. Filter Tabs
let currentFilter = 'all';
function initFilterTabs() {
  const tabs = document.querySelectorAll('.catalog-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25');
        t.classList.add('bg-slate-900/60', 'text-slate-400', 'border-white/5');
      });
      tab.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-white/5');
      tab.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/25');

      currentFilter = tab.dataset.category || 'all';
      const searchVal = document.getElementById('modSearchInput') ? document.getElementById('modSearchInput').value : '';
      renderCatalog(currentFilter, searchVal);
    });
  });
}

// 5. Search Bar
function initSearch() {
  const searchInput = document.getElementById('modSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    renderCatalog(currentFilter, e.target.value);
  });
}

// 6. Modal Viewer
window.openModModal = function(id) {
  const mod = FEATURED_MODS.find(m => m.id === id);
  if (!mod) return;

  const modal = document.getElementById('modModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalHero = document.getElementById('modalHero');
  const modalDesc = document.getElementById('modalDesc');
  const modalBadge = document.getElementById('modalBadge');

  if (modalImg) modalImg.src = mod.preview;
  if (modalTitle) modalTitle.textContent = mod.title;
  if (modalHero) modalHero.textContent = `${mod.hero} • ${mod.rarity}`;
  if (modalDesc) modalDesc.textContent = mod.description;
  if (modalBadge) modalBadge.textContent = mod.badge;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModModal = function() {
  const modal = document.getElementById('modModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
};

// 7. FAQ Accordion
function initFaqAccordion() {
  const toggles = document.querySelectorAll('.faq-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.faq-item');
      const content = parent.querySelector('.faq-content');
      const icon = toggle.querySelector('.faq-icon');

      const isOpen = !content.classList.contains('hidden');
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// 8. Fetch GitHub Releases Live Info + Download Count
async function fetchGitHubReleaseInfo() {
  try {
    // Fetch all releases to sum total downloads
    const [latestRes, allRes] = await Promise.all([
      fetch('https://api.github.com/repos/terbixsorr/DotaModHub/releases/latest'),
      fetch('https://api.github.com/repos/terbixsorr/DotaModHub/releases?per_page=100')
    ]);

    // Latest release info
    if (latestRes.ok) {
      const data = await latestRes.json();

      const tagBadge = document.getElementById('githubReleaseTag');
      if (tagBadge && data.tag_name) {
        tagBadge.textContent = data.tag_name;
      }
      // Also update stats strip version badge
      const tagStat = document.getElementById('githubReleaseTagStat');
      if (tagStat && data.tag_name) {
        tagStat.textContent = data.tag_name;
      }

      const sizeBadge = document.getElementById('exeFileSize');
      if (sizeBadge && data.assets && data.assets.length > 0) {
        const exeAsset = data.assets.find(a => a.name.endsWith('.exe'));
        if (exeAsset) {
          sizeBadge.textContent = (exeAsset.size / (1024 * 1024)).toFixed(0) + ' MB';
        }
      }
    }

    // Total downloads across ALL releases
    if (allRes.ok) {
      const releases = await allRes.json();
      let total = 0;
      releases.forEach(release => {
        (release.assets || []).forEach(asset => {
          total += asset.download_count || 0;
        });
      });

      // Animate counter
      const el = document.getElementById('totalDownloads');
      if (el) {
        animateCounter(el, total);
      }

      // Also update hero counter if present
      const heroEl = document.getElementById('heroDownloadCount');
      if (heroEl) {
        animateCounter(heroEl, total);
      }
    }
  } catch (e) {
    console.debug('GitHub API notice:', e);
  }
}

// Smooth animated number counter
function animateCounter(el, target) {
  if (!el) return;
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('ru-RU');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// 9. Anime.js Entrance & Float Physics
function initAnimeAnimations() {
  if (typeof anime === 'undefined') return;

  // Hero staggered reveal
  anime({
    targets: '.anime-hero-fade',
    opacity: [0, 1],
    translateY: [25, 0],
    delay: anime.stagger(120, { start: 200 }),
    duration: 900,
    easing: 'easeOutCubic'
  });

  // Floating mockup tilt effect
  anime({
    targets: '.anime-float-mockup',
    translateY: [-6, 6],
    duration: 4000,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutQuad'
  });

  // Background glow pulse
  anime({
    targets: '.anime-pulse-glow',
    scale: [0.95, 1.05],
    opacity: [0.15, 0.3],
    duration: 5000,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
}
