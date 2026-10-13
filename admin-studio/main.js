const { app, BrowserWindow, ipcMain, dialog, shell, Notification, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

let mainWindow = null;
let tray = null;
let isQuitting = false;
let incomingWatcher = null;

// Helper: resolve default DotaMod Hub directory robustly
function getDotaHubDirectory(customPath) {
  if (customPath && fs.existsSync(path.join(customPath, 'data', 'mods.json'))) {
    return customPath;
  }
  // Walk up up to 6 levels to find root containing data/mods.json
  let curr = path.resolve(__dirname);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(curr, 'data', 'mods.json'))) {
      return curr;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  // Fallback to standard directory
  const fallback = 'c:\\безопасный интернет';
  if (fs.existsSync(path.join(fallback, 'data', 'mods.json'))) return fallback;
  return path.resolve(__dirname, '..');
}

function getAppIcon() {
  const root = getDotaHubDirectory();
  const studioIco = path.join(__dirname, 'studio_icon.ico');
  if (fs.existsSync(studioIco)) return studioIco;
  const studioPng = path.join(__dirname, 'studio_icon.png');
  if (fs.existsSync(studioPng)) return studioPng;
  const rootStudioIco = path.join(root, 'assets', 'studio_icon.ico');
  if (fs.existsSync(rootStudioIco)) return rootStudioIco;
  const rootStudioPng = path.join(root, 'assets', 'studio_icon.png');
  if (fs.existsSync(rootStudioPng)) return rootStudioPng;

  const pngPath = path.join(root, 'assets', 'modhub_avatar_transparent.png');
  if (fs.existsSync(pngPath)) return pngPath;
  const icoPath = path.join(root, 'dist', 'app.ico');
  if (fs.existsSync(icoPath)) return icoPath;
  return null;
}

function createWindow() {
  const icon = getAppIcon();
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    title: 'DotaMod Studio — Авто-Мониторинг & Каталог',
    backgroundColor: '#0c0e14',
    icon: icon || undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('close', (event) => {
    if (tray && !isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      if (Notification.isSupported()) {
        try {
          new Notification({
            title: 'DotaMod Studio работает в фоне',
            body: 'Приложение продолжает авто-мониторинг модов в системном трее.'
          }).show();
        } catch (e) {}
      }
    }
  });

  createTray();
  startIncomingFolderWatcher();
}

function createTray() {
  if (tray) return;
  try {
    const iconPath = getAppIcon();
    if (!iconPath || !fs.existsSync(iconPath)) return;
    const nImg = nativeImage.createFromPath(iconPath);
    if (nImg.isEmpty()) return;
    const trayImg = nImg.resize({ width: 16, height: 16 });
    tray = new Tray(trayImg);
    tray.setToolTip('DotaMod Studio — Авто-Мониторинг');

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Открыть DotaMod Studio',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: 'Проверить новые моды сейчас',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.webContents.send('admin:trigger-check');
          }
        }
      },
      {
        label: 'Открыть папку входящих (incoming_mods)',
        click: () => {
          const incomingPath = path.join(__dirname, 'incoming_mods');
          if (fs.existsSync(incomingPath)) shell.openPath(incomingPath);
        }
      },
      { type: 'separator' },
      {
        label: 'Выход',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (err) {
    console.error('Tray init error:', err);
    tray = null;
  }
}

function startIncomingFolderWatcher() {
  if (incomingWatcher) return;
  const incomingPath = path.join(__dirname, 'incoming_mods');
  if (!fs.existsSync(incomingPath)) {
    try { fs.mkdirSync(incomingPath, { recursive: true }); } catch (e) {}
  }

  let debounceTimer = null;
  try {
    incomingWatcher = fs.watch(incomingPath, (eventType, filename) => {
      if (!filename) return;
      const ext = path.extname(filename).toLowerCase();
      if (ext !== '.vpk' && ext !== '.zip') return;

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('admin:incoming-changed', { eventType, filename });
        }
        if (Notification.isSupported() && eventType === 'rename') {
          const fullPath = path.join(incomingPath, filename);
          if (fs.existsSync(fullPath)) {
            new Notification({
              title: 'DotaMod Studio: Новый файл!',
              body: `Обнаружен мод: ${filename}. Добавлен в очередь локальных файлов.`,
              icon: getAppIcon() || undefined
            }).show();
          }
        }
      }, 600);
    });
  } catch (e) {}
}

app.whenReady().then(createWindow);

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (!tray || isQuitting) app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createWindow();
  }
});

// IPC: Show native Desktop notification
ipcMain.handle('admin:show-notification', async (event, { title, body }) => {
  if (Notification.isSupported()) {
    try {
      const notif = new Notification({
        title: title || 'DotaMod Studio',
        body: body || '',
        icon: getAppIcon() || undefined
      });
      notif.on('click', () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('admin:switch-tab', 'monitor');
        }
      });
      notif.show();
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
  return { success: false, message: 'Уведомления не поддерживаются' };
});

// IPC: Focus window
ipcMain.handle('admin:focus-window', async () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    return true;
  }
  return false;
});

// IPC: Get App Paths
ipcMain.handle('admin:get-app-paths', async () => {
  const hubPath = getDotaHubDirectory();
  const incomingPath = path.join(__dirname, 'incoming_mods');
  if (!fs.existsSync(incomingPath)) {
    try { fs.mkdirSync(incomingPath, { recursive: true }); } catch (e) {}
  }
  return {
    hubPath,
    incomingPath,
    distAppPath: path.join(hubPath, 'dist', 'DotaModHub-win32-x64', 'resources', 'app')
  };
});

// IPC: Load Catalog
ipcMain.handle('admin:load-catalog', async (event, hubPath) => {
  try {
    const root = getDotaHubDirectory(hubPath);
    const jsonPath = path.join(root, 'data', 'mods.json');
    if (!fs.existsSync(jsonPath)) {
      return { success: false, message: 'Файл data/mods.json не найден по пути: ' + root, mods: [] };
    }
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const mods = JSON.parse(raw);
    return { success: true, mods, count: mods.length, path: jsonPath };
  } catch (err) {
    return { success: false, message: err.message, mods: [] };
  }
});

// IPC: Save Catalog
ipcMain.handle('admin:save-catalog', async (event, { hubPath, mods }) => {
  try {
    const root = getDotaHubDirectory(hubPath);
    const dataDir = path.join(root, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const jsonPath = path.join(dataDir, 'mods.json');
    const jsPath = path.join(dataDir, 'mods-data.js');

    // 1. Write formatted mods.json
    fs.writeFileSync(jsonPath, JSON.stringify(mods, null, 2), 'utf8');

    // 2. Write offline fallback mods-data.js
    const jsContent = `/**\n * DotaMod Hub - Offline Data Cache\n * Auto-generated by DotaMod Studio on ${new Date().toISOString()}\n */\nwindow.CATALOG_MODS = ${JSON.stringify(mods, null, 2)};\n`;
    fs.writeFileSync(jsPath, jsContent, 'utf8');

    // 3. Mirror directly into dist build if it exists
    const distDataDir = path.join(root, 'dist', 'DotaModHub-win32-x64', 'resources', 'app', 'data');
    if (fs.existsSync(distDataDir)) {
      try {
        fs.writeFileSync(path.join(distDataDir, 'mods.json'), JSON.stringify(mods, null, 2), 'utf8');
        fs.writeFileSync(path.join(distDataDir, 'mods-data.js'), jsContent, 'utf8');
      } catch (e) {}
    }

    return { 
      success: true, 
      count: mods.length, 
      message: `Каталог успешно сохранен! Всего модов: ${mods.length}. Файлы обновлены локально и в сборке dist.` 
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC: Inspect a single local mod file (.vpk or .zip)
ipcMain.handle('admin:inspect-file', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'Файл не найден' };
    }
    const stat = fs.statSync(filePath);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Auto-detect Pak Number if present
    const pakMatch = fileName.match(/pak(\d+)_dir\.vpk/i);
    const pakNumber = pakMatch ? pakMatch[1] : null;

    // Detect Hero Name / Category from filename
    const cleanBase = fileName.replace(/\.[^.]+$/, '').replace(/_dir$/, '').replace(/^pak\d+_?/, '').trim();
    
    // Scan inner content if VPK
    let hasEffects = false;
    let hasIcons = false;
    let hasSounds = false;
    let detectedHero = '';

    if (ext === '.vpk') {
      const fd = fs.openSync(filePath, 'r');
      const buffer = Buffer.alloc(Math.min(stat.size, 1024 * 512));
      fs.readSync(fd, buffer, 0, buffer.length, 0);
      fs.closeSync(fd);

      const ascii = buffer.toString('binary');
      if (ascii.includes('particles')) hasEffects = true;
      if (ascii.includes('spellicons') || ascii.includes('items/')) hasIcons = true;
      if (ascii.includes('sounds/') || ascii.includes('.vsnd_c')) hasSounds = true;

      // Extract hero name candidates
      const heroMatches = ascii.match(/heroes\/([a-z0-9_]+)/g);
      if (heroMatches && heroMatches.length > 0) {
        const h = heroMatches[0].replace('heroes/', '');
        detectedHero = h.charAt(0).toUpperCase() + h.slice(1).replace(/_/g, ' ');
      }
    }

    return {
      success: true,
      file: {
        fileName,
        filePath,
        sizeMb: `${sizeMb} MB`,
        pakNumber,
        cleanBase,
        ext,
        hasEffects,
        hasIcons,
        hasSounds,
        detectedHero
      }
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC: Scan Incoming Folder
ipcMain.handle('admin:scan-incoming', async (event, folderPath) => {
  try {
    const dir = folderPath || path.join(__dirname, 'incoming_mods');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      return { success: true, files: [], folder: dir };
    }

    const items = fs.readdirSync(dir);
    const modFiles = [];

    for (const item of items) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (!stat.isFile()) continue;

      const ext = path.extname(item).toLowerCase();
      if (ext === '.vpk' || ext === '.zip') {
        const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
        const pakMatch = item.match(/pak(\d+)_dir\.vpk/i);
        modFiles.push({
          name: item,
          fullPath: full,
          sizeMb: `${sizeMb} MB`,
          ext,
          pakNumber: pakMatch ? pakMatch[1] : null,
          mtime: stat.mtime
        });
      }
    }

    return { success: true, files: modFiles, folder: dir };
  } catch (err) {
    return { success: false, message: err.message, files: [] };
  }
});

// IPC: Check GitHub for New Mods
ipcMain.handle('admin:check-github', async (event, { repo, currentMods }) => {
  return new Promise((resolve) => {
    const targetRepo = repo || 'h6rd/Dota2PornFxWeb';

    function fetchJson(url) {
      return new Promise((res, rej) => {
        const client = url.startsWith('https://') ? https : http;
        client.get(url, (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            return fetchJson(response.headers.location).then(res).catch(rej);
          }
          if (response.statusCode !== 200) {
            return rej(new Error(`HTTP ${response.statusCode}`));
          }
          let body = '';
          response.on('data', c => body += c);
          response.on('end', () => {
            try { res(JSON.parse(body)); } catch (e) { rej(e); }
          });
        }).on('error', rej);
      });
    }

    Promise.all([
      fetchJson(`https://raw.githubusercontent.com/${targetRepo}/main/assets/data/mods.json`),
      fetchJson(`https://raw.githubusercontent.com/${targetRepo}/main/assets/data/constants.json`).catch(() => ({}))
    ]).then(([modsDoc, constsDoc]) => {
      const heroesList = (constsDoc && constsDoc.HEROES_LIST) || [];

      // Build dictionary of known hero icons
      const knownHeroIcons = {};
      if (Array.isArray(currentMods)) {
        currentMods.forEach(m => {
          if (m.hero && m.hero_icon && !m.hero_icon.includes('dota2_logo_symbol') && !knownHeroIcons[m.hero.toLowerCase()]) {
            knownHeroIcons[m.hero.toLowerCase()] = m.hero_icon;
          }
        });
      }

      function getHeroAvatar(heroName) {
        if (!heroName || heroName === 'Dota 2' || heroName === 'Other') {
          return 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png';
        }
        const clean = heroName.toLowerCase().trim();
        if (knownHeroIcons[clean]) return knownHeroIcons[clean];
        const slug = clean.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${slug}.png`;
      }

      function findHero(title, cat) {
        if (cat !== 'heroes' && cat !== 'hero-items' && cat !== 'herofx' && cat !== 'hero-sounds') {
          if (cat === 'backgrounds') return 'Backgrounds';
          if (cat === 'terrains') return 'Terrains';
          if (cat === 'creeps') return 'Creeps';
          if (cat === 'towers') return 'Towers';
          if (cat === 'roshan') return 'Roshan';
          return cat.charAt(0).toUpperCase() + cat.slice(1);
        }
        for (const h of heroesList) {
          const escaped = h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const reg = new RegExp('\\b' + escaped + '\\b', 'i');
          if (reg.test(title)) return h;
        }
        return 'Dota 2';
      }

      const catMap = {
        'heroes': 'sets',
        'hero-items': 'hero-items',
        'herofx': 'herofx',
        'hero-sounds': 'hero-sounds',
        'backgrounds': 'backgrounds',
        'terrains': 'terrains',
        'shaders': 'shaders',
        'fonts': 'fonts',
        'mega-kill': 'mega-kill',
        'high-five': 'high-five',
        'ranged-attack': 'attack-fx',
        'couriers': 'couriers',
        'wards': 'wards',
        'creeps': 'creeps',
        'river': 'river',
        'trees': 'trees',
        'versus-screens': 'versus-screens',
        'towers': 'sets',
        'roshan': 'sets',
        'ancient': 'sets',
        'tormentor': 'sets',
        'announcers': 'hero-sounds'
      };

      const currentUrls = new Set();
      const currentTitles = new Set();
      if (Array.isArray(currentMods)) {
        currentMods.forEach(m => {
          if (m.download_url) currentUrls.add(m.download_url.toLowerCase().trim());
          if (m.title) currentTitles.add(m.title.toLowerCase().replace(/[^a-z0-9]/g, ''));
        });
      }

      const newCandidates = [];
      const seenTitles = new Set();

      function processItem(item, catKey) {
        if (!item || !item.name) return;
        const rawTitle = item.name.trim();
        if (!rawTitle) return;

        const normalizedTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (currentTitles.has(normalizedTitle) || seenTitles.has(normalizedTitle)) return;
        seenTitles.add(normalizedTitle);

        let previewFile = item.preview;
        let downloadFile = item.file;
        if (!previewFile && Array.isArray(item.styles) && item.styles.length > 0) {
          previewFile = item.styles[0].preview;
        }
        if (!downloadFile && Array.isArray(item.styles) && item.styles.length > 0) {
          downloadFile = item.styles[0].file;
        }
        if (!downloadFile) return;

        let previewUrl = null;
        if (previewFile) {
          if (previewFile.startsWith('http://') || previewFile.startsWith('https://')) {
            previewUrl = previewFile;
          } else if (previewFile.startsWith('assets/previews/')) {
            previewUrl = `https://raw.githubusercontent.com/${targetRepo}/main/${previewFile}`;
          } else {
            previewUrl = `https://raw.githubusercontent.com/${targetRepo}/main/assets/previews/${catKey}/${encodeURIComponent(previewFile)}`;
          }
        }

        let downloadUrl = '';
        if (downloadFile) {
          if (downloadFile.startsWith('http://') || downloadFile.startsWith('https://')) {
            downloadUrl = downloadFile;
          } else {
            downloadUrl = `https://raw.githubusercontent.com/${targetRepo}/main/assets/files/${catKey}/${encodeURIComponent(downloadFile)}`;
          }
        }

        if (downloadUrl && currentUrls.has(downloadUrl.toLowerCase().trim())) return;

        const heroName = findHero(rawTitle, catKey);
        const heroAvatar = getHeroAvatar(heroName);
        if (!previewUrl) previewUrl = heroAvatar;

        const category = catMap[catKey] || 'sets';
        const hasEffects = !!(item.tags && item.tags.effects);
        const hasIcons = !!(item.tags && item.tags.icons);

        newCandidates.push({
          id: rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `mod-${Date.now()}-${newCandidates.length}`,
          title: rawTitle,
          category,
          hero: heroName,
          hero_icon: heroAvatar,
          file_size: item.size || '35 MB',
          download_url: downloadUrl,
          preview: previewUrl,
          has_effects: hasEffects,
          has_icons: hasIcons
        });
      }

      if (modsDoc && modsDoc.modsData) {
        for (const [catKey, catData] of Object.entries(modsDoc.modsData)) {
          if (Array.isArray(catData)) {
            catData.forEach(it => {
              processItem(it, catKey);
              if (it && Array.isArray(it.mods)) it.mods.forEach(sub => processItem(sub, catKey));
            });
          } else if (catData && typeof catData === 'object' && Array.isArray(catData.groups)) {
            catData.groups.forEach(g => {
              if (g && Array.isArray(g.mods)) g.mods.forEach(sub => processItem(sub, catKey));
            });
          }
        }
      }

      resolve({
        success: true,
        repo: targetRepo,
        totalRemoteMods: (modsDoc && modsDoc.modsData) ? Object.keys(modsDoc.modsData).length : 0,
        newCount: newCandidates.length,
        candidates: newCandidates
      });
    }).catch(err => {
      resolve({ success: false, message: 'Ошибка сети / парсинга метаданных GitHub: ' + err.message });
    });
  });
});

// IPC: Publish updated catalog to GitHub using Personal Access Token
ipcMain.handle('admin:publish-github', async (event, { token, repo, branch, mods, commitMessage }) => {
  return new Promise((resolve) => {
    if (!token || !repo) {
      resolve({ success: false, message: 'Укажите токен GitHub (PAT) и репозиторий в настройках' });
      return;
    }

    const targetBranch = branch || 'main';
    const filePath = 'data/mods.json';
    const contentStr = JSON.stringify(mods, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString('base64');
    const msg = commitMessage || `Update mods catalog (${mods.length} mods) via DotaMod Studio`;

    // 1. Get current SHA of data/mods.json
    const getOpt = {
      hostname: 'api.github.com',
      path: `/repos/${repo}/contents/${filePath}?ref=${targetBranch}`,
      headers: {
        'User-Agent': 'DotaModStudio/1.0',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(getOpt, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let sha = null;
        try {
          const parsed = JSON.parse(body);
          if (parsed && parsed.sha) sha = parsed.sha;
        } catch (e) {}

        // 2. PUT updated content
        const payload = JSON.stringify({
          message: msg,
          content: contentBase64,
          branch: targetBranch,
          ...(sha ? { sha } : {})
        });

        const putReq = https.request({
          hostname: 'api.github.com',
          path: `/repos/${repo}/contents/${filePath}`,
          method: 'PUT',
          headers: {
            'User-Agent': 'DotaModStudio/1.0',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        }, (putRes) => {
          let putBody = '';
          putRes.on('data', c => putBody += c);
          putRes.on('end', () => {
            try {
              const resData = JSON.parse(putBody);
              if (putRes.statusCode === 200 || putRes.statusCode === 201) {
                resolve({ 
                  success: true, 
                  commitUrl: resData.commit && resData.commit.html_url,
                  message: `Успешно опубликовано на GitHub! Коммит создан в ветке ${targetBranch}.` 
                });
              } else {
                resolve({ 
                  success: false, 
                  message: resData.message || 'Ошибка загрузки на GitHub' 
                });
              }
            } catch (err) {
              resolve({ success: false, message: err.message });
            }
          });
        });

        putReq.on('error', (err) => {
          resolve({ success: false, message: 'Сетевая ошибка: ' + err.message });
        });

        putReq.write(payload);
        putReq.end();
      });
    }).on('error', (err) => {
      resolve({ success: false, message: 'Не удалось проверить текущий файл на GitHub: ' + err.message });
    });
  });
});

// IPC: Test URL (check if 200 OK)
ipcMain.handle('admin:test-url', async (event, url) => {
  return new Promise((resolve) => {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      resolve({ success: false, status: 0 });
      return;
    }
    const client = url.startsWith('https://') ? https : http;
    client.get(url, (res) => {
      resolve({ success: res.statusCode === 200, status: res.statusCode });
    }).on('error', () => {
      resolve({ success: false, status: 0 });
    });
  });
});

// IPC: Native Dialogs
ipcMain.handle('admin:select-directory', async (event, defaultPath) => {
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    defaultPath: defaultPath || app.getPath('desktop')
  });
  return res.canceled ? null : res.filePaths[0];
});

ipcMain.handle('admin:select-file', async (event, filters) => {
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || [{ name: 'Mod Files', extensions: ['vpk', 'zip', 'png', 'jpg', 'webp'] }]
  });
  return res.canceled ? null : res.filePaths[0];
});

// IPC: Open Folder in Windows Explorer
ipcMain.handle('admin:open-folder', async (event, targetPath) => {
  if (fs.existsSync(targetPath)) {
    shell.openPath(targetPath);
    return { success: true };
  }
  return { success: false, message: 'Папка не существует' };
});
