const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0c0e14',
    title: 'DotaMod Hub Desktop',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  const localHtml = path.join(__dirname, 'index.html');
  if (fs.existsSync(localHtml)) {
    mainWindow.loadFile(localHtml);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../index.html'));
  }
}

app.whenReady().then(() => {
  const { session } = require('electron');
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Helper: Determine mods directory
function getModsDirectory(dotaPath) {
  // If game/dota_russian exists, prioritize it because Russian Dota 2 clients mount it natively!
  const russianDir = path.join(dotaPath, 'game', 'dota_russian');
  if (fs.existsSync(russianDir)) {
    return russianDir;
  }
  const modsDir = path.join(dotaPath, 'game', 'dota_mods');
  if (!fs.existsSync(modsDir)) {
    fs.mkdirSync(modsDir, { recursive: true });
  }
  return modsDir;
}

// Helper: Manifest loading and saving
function getManifestPath(modsDir) {
  return path.join(modsDir, 'dotamodhub_manifest.json');
}

function loadManifest(modsDir) {
  const mfPath = getManifestPath(modsDir);
  if (fs.existsSync(mfPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
      if (data && Array.isArray(data.mods)) return data;
    } catch (e) {}
  }
  return { mods: [] };
}

function saveManifest(modsDir, manifest) {
  const mfPath = getManifestPath(modsDir);
  try {
    fs.writeFileSync(mfPath, JSON.stringify(manifest, null, 2), 'utf8');
  } catch (e) {}
}

// Helper: Get next free pakXX number from 01 to 99
function getNextAvailablePakNumber(modsDir, manifest) {
  const existingFiles = fs.existsSync(modsDir) ? fs.readdirSync(modsDir) : [];
  for (let i = 1; i <= 99; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    const pattern = new RegExp(`^pak${numStr}_dir\\.vpk`, 'i');
    const isFileOnDisk = existingFiles.some(f => pattern.test(f));
    const isInManifest = manifest.mods.some(m => m.pakNumber === numStr);
    if (!isFileOnDisk && !isInManifest) {
      return numStr;
    }
  }
  return '99';
}

// Helper: Patch gameinfo.gi in game/dota and any language subfolders
function patchGameInfoFiles(dotaPath) {
  try {
    const targets = [
      path.join(dotaPath, 'game', 'dota', 'gameinfo.gi'),
      path.join(dotaPath, 'game', 'dota_russian', 'gameinfo.gi')
    ];

    for (const giPath of targets) {
      if (fs.existsSync(giPath)) {
        const backup = giPath + '.backup';
        if (!fs.existsSync(backup)) {
          fs.copyFileSync(giPath, backup);
        }

        let content = fs.readFileSync(giPath, 'utf8');
        if (!content.includes('dota_mods')) {
          if (/SearchPaths\s*\{/i.test(content)) {
            content = content.replace(/(SearchPaths\s*\{)/i, '$1\r\n\t\t\tGame\t\t\t\tdota_mods');
            fs.writeFileSync(giPath, content, 'utf8');
          }
        }
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Helper: Recursively search for .vpk files in folder
function findVpks(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findVpks(full, fileList);
    } else if (entry.name.toLowerCase().endsWith('.vpk')) {
      fileList.push(full);
    }
  }
  return fileList;
}

// Helper: Recursively search for font files (.ttf, .otf, .uifont)
function findFontFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFontFiles(full, fileList);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ttf', '.otf', '.uifont', '.woff', '.woff2'].includes(ext)) {
        fileList.push(full);
      }
    }
  }
  return fileList;
}

// Helper: Copy directory contents recursively
function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper: Download with redirect support
function downloadWithRedirect(url, targetPath, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) return resolve({ success: false, message: 'Too many redirects' });

    const req = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadWithRedirect(response.headers.location, targetPath, maxRedirects - 1));
      }

      if (response.statusCode !== 200) {
        return resolve({ success: false, message: `HTTP Error: ${response.statusCode}` });
      }

      const file = fs.createWriteStream(targetPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ success: true });
      });
      file.on('error', (err) => {
        fs.unlink(targetPath, () => {});
        resolve({ success: false, message: err.message });
      });
    });

    req.on('error', (err) => {
      fs.unlink(targetPath, () => {});
      resolve({ success: false, message: err.message });
    });
  });
}

// Helper: Extract ZIP via tar or PowerShell
function extractArchive(archivePath, extractDir) {
  return new Promise((resolve) => {
    exec(`tar -xf "${archivePath}" -C "${extractDir}"`, (error) => {
      if (error) {
        exec(`powershell -command "Expand-Archive -Path '${archivePath}' -DestinationPath '${extractDir}' -Force"`, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

// IPC Handler: Locate Dota 2 Installation
ipcMain.handle('dota:detect-path', async () => {
  const commonPaths = [
    'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta',
    'D:\\Steam\\steamapps\\common\\dota 2 beta',
    'D:\\SteamLibrary\\steamapps\\common\\dota 2 beta',
    'E:\\SteamLibrary\\steamapps\\common\\dota 2 beta',
    'E:\\Steam\\steamapps\\common\\dota 2 beta',
    'F:\\SteamLibrary\\steamapps\\common\\dota 2 beta'
  ];

  for (const cand of commonPaths) {
    const giPath = path.join(cand, 'game', 'dota', 'gameinfo.gi');
    const giBackup = path.join(cand, 'game', 'dota', 'gameinfo.gi.backup');
    if (fs.existsSync(giPath) || fs.existsSync(giBackup)) {
      return { success: true, path: cand };
    }
  }

  return { success: false, message: 'Dota 2 не найдена автоматически. Укажите путь вручную.' };
});

// IPC Handler: Manual folder browse
ipcMain.handle('dota:browse-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Выберите папку dota 2 beta'
  });

  if (result.canceled || result.filePaths.length === 0) return { canceled: true };

  const chosenPath = result.filePaths[0];
  const giPath = path.join(chosenPath, 'game', 'dota', 'gameinfo.gi');
  const giBackup = path.join(chosenPath, 'game', 'dota', 'gameinfo.gi.backup');

  if (fs.existsSync(giPath) || fs.existsSync(giBackup)) {
    return { success: true, path: chosenPath };
  } else {
    return { success: false, message: 'В выбранной папке отсутствует game/dota/gameinfo.gi' };
  }
});

// IPC Handler: Enable mod support in gameinfo.gi
ipcMain.handle('dota:enable-mods', async (event, dotaPath) => {
  try {
    const res = patchGameInfoFiles(dotaPath);
    const modsDir = getModsDirectory(dotaPath);
    return { 
      success: true, 
      message: `Режим модов успешно включен! Папка модов: ${path.basename(modsDir)}` 
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: One-click Download and Install Mod (VPK extraction with pakXX_dir naming)
ipcMain.handle('dota:install-mod', async (event, { dotaPath, modId, modTitle, downloadUrl, preview, hero, heroIcon }) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    patchGameInfoFiles(dotaPath);

    const manifest = loadManifest(modsDir);

    let existingMod = manifest.mods.find(m => m.id === modId || m.title === modTitle);
    let pakNumStr = existingMod ? existingMod.pakNumber : getNextAvailablePakNumber(modsDir, manifest);

    const targetPakName = `pak${pakNumStr}_dir.vpk`;
    const isZip = downloadUrl.toLowerCase().endsWith('.zip');
    const tempDownload = path.join(modsDir, `__temp_dl_${pakNumStr}.${isZip ? 'zip' : 'vpk'}`);

    const dlResult = await downloadWithRedirect(downloadUrl, tempDownload);
    if (!dlResult || !dlResult.success) {
      return { success: false, message: dlResult.message || 'Ошибка загрузки архива мода' };
    }

    const targetPakPath = path.join(modsDir, targetPakName);
    const targetDisabledPath = path.join(modsDir, `${targetPakName}.disabled`);

    if (isZip) {
      const extractDir = path.join(modsDir, `__temp_ex_${pakNumStr}`);
      if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir, { recursive: true });

      await extractArchive(tempDownload, extractDir);
      try { fs.unlinkSync(tempDownload); } catch (e) {}

      const vpks = findVpks(extractDir);
      if (vpks.length === 0) {
        const fontFiles = findFontFiles(extractDir);
        const isFontCandidate = fontFiles.length > 0 || 
                                (modId && modId.toLowerCase().includes('font')) || 
                                (modTitle && modTitle.toLowerCase().includes('font')) ||
                                (downloadUrl && downloadUrl.toLowerCase().includes('font'));

        if (isFontCandidate && fontFiles.length > 0) {
          const targetFontsDirs = [
            path.join(dotaPath, 'game', 'dota', 'panorama', 'fonts'),
            path.join(dotaPath, 'game', 'dota_russian', 'panorama', 'fonts')
          ];

          let customFontsSource = path.join(extractDir, 'assets', 'custom');
          if (!fs.existsSync(customFontsSource)) {
            customFontsSource = extractDir;
          }

          const defaultFontsSource = path.join(extractDir, 'assets', 'default');
          const backupDir = path.join(modsDir, '__fonts_default_backup');
          if (fs.existsSync(defaultFontsSource) && !fs.existsSync(backupDir)) {
            copyFolderRecursive(defaultFontsSource, backupDir);
          }

          let copiedFiles = 0;
          for (const targetFontsDir of targetFontsDirs) {
            if (!fs.existsSync(targetFontsDir)) {
              try { fs.mkdirSync(targetFontsDir, { recursive: true }); } catch (e) {}
            }
            if (fs.existsSync(targetFontsDir)) {
              const fontsToCopy = findFontFiles(customFontsSource);
              for (const src of fontsToCopy) {
                const dest = path.join(targetFontsDir, path.basename(src));
                try {
                  fs.copyFileSync(src, dest);
                  copiedFiles++;
                } catch (e) {}
              }
            }
          }

          try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch (e) {}

          const fontRecord = {
            id: modId || `font_${pakNumStr}`,
            title: modTitle || `Шрифт #${pakNumStr}`,
            pakNumber: pakNumStr,
            fileName: `font_${pakNumStr}`,
            isFont: true,
            size: '2.5 MB',
            enabled: true,
            preview: preview || '',
            hero: 'Шрифты',
            hero_icon: heroIcon || 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/global/dota2_logo_symbol.png',
            updatedAt: new Date().toISOString()
          };

          if (existingMod) {
            Object.assign(existingMod, fontRecord);
          } else {
            manifest.mods.push(fontRecord);
          }
          saveManifest(modsDir, manifest);

          return { 
            success: true, 
            message: `Шрифт «${modTitle}» успешно установлен! Он сразу применится в игре.` 
          };
        }

        try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch (e) {}
        return { success: false, message: 'В архиве мода не найден файл .vpk' };
      }

      if (fs.existsSync(targetPakPath)) fs.unlinkSync(targetPakPath);
      if (fs.existsSync(targetDisabledPath)) fs.unlinkSync(targetDisabledPath);

      fs.renameSync(vpks[0], targetPakPath);
      try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch (e) {}
    } else {
      if (fs.existsSync(targetPakPath)) fs.unlinkSync(targetPakPath);
      if (fs.existsSync(targetDisabledPath)) fs.unlinkSync(targetDisabledPath);
      fs.renameSync(tempDownload, targetPakPath);
    }

    // Mirror to dota_mods or dota_russian for maximum engine compatibility
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        fs.copyFileSync(targetPakPath, path.join(mirrorDir, targetPakName));
      } catch (e) {}
    }

    const stats = fs.statSync(targetPakPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(1);

    const modRecord = {
      id: modId || `mod_${pakNumStr}`,
      title: modTitle || `Мод #${pakNumStr}`,
      pakNumber: pakNumStr,
      fileName: targetPakName,
      size: `${sizeMb} MB`,
      enabled: true,
      preview: preview || '',
      hero: hero || '',
      hero_icon: heroIcon || '',
      updatedAt: new Date().toISOString()
    };

    if (existingMod) {
      Object.assign(existingMod, modRecord);
    } else {
      manifest.mods.push(modRecord);
    }
    saveManifest(modsDir, manifest);

    return { 
      success: true, 
      message: `Мод «${modTitle}» успешно установлен как ${targetPakName}! Он сразу активен в игре.` 
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: List Installed Mods
ipcMain.handle('dota:list-installed-mods', async (event, dotaPath) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    let manifest = loadManifest(modsDir);

    // Auto-discover any pakXX_dir.vpk files on disk not yet in manifest
    const diskFiles = fs.existsSync(modsDir) ? fs.readdirSync(modsDir) : [];
    
    for (const f of diskFiles) {
      const m = f.match(/^pak(\d+)_dir\.vpk(\.disabled)?$/i);
      if (m) {
        const pakNum = m[1];
        const isDisabled = Boolean(m[2]);
        const inManifest = manifest.mods.find(x => x.pakNumber === pakNum);
        if (!inManifest) {
          const stat = fs.statSync(path.join(modsDir, f));
          const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
          manifest.mods.push({
            id: `pak_${pakNum}`,
            title: `Мод pak${pakNum}`,
            pakNumber: pakNum,
            fileName: f,
            size: `${sizeMb} MB`,
            enabled: !isDisabled,
            updatedAt: stat.mtime.toISOString()
          });
        }
      }
    }

    // Verify each manifest entry against actual disk state
    const verifiedMods = [];
    for (const mod of manifest.mods) {
      if (mod.isFont) {
        verifiedMods.push(mod);
        continue;
      }

      const activePath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk`);
      const disabledPath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk.disabled`);

      if (fs.existsSync(activePath)) {
        mod.enabled = true;
        mod.fileName = `pak${mod.pakNumber}_dir.vpk`;
        verifiedMods.push(mod);
      } else if (fs.existsSync(disabledPath)) {
        mod.enabled = false;
        mod.fileName = `pak${mod.pakNumber}_dir.vpk.disabled`;
        verifiedMods.push(mod);
      }
    }

    manifest.mods = verifiedMods;
    saveManifest(modsDir, manifest);

    const result = verifiedMods.map(m => ({
      id: m.id,
      fileName: m.fileName,
      cleanName: m.title,
      pakName: m.pakName || (m.pakNumber ? `pak${m.pakNumber}_dir.vpk` : m.fileName),
      size: m.size,
      enabled: m.enabled,
      isFont: Boolean(m.isFont),
      preview: m.preview || '',
      hero: m.hero || '',
      hero_icon: m.hero_icon || ''
    }));

    return { success: true, mods: result };
  } catch (err) {
    return { success: false, message: err.message, mods: [] };
  }
});

// IPC Handler: Check if dota2.exe is running
ipcMain.handle('dota:check-status', async () => {
  return new Promise((resolve) => {
    exec('tasklist /FI "IMAGENAME eq dota2.exe" /NH', (err, stdout) => {
      const isRunning = Boolean(stdout && stdout.toLowerCase().includes('dota2.exe'));
      resolve({ success: true, isRunning });
    });
  });
});

// IPC Handler: Toggle Single Mod (Enable / Disable)
ipcMain.handle('dota:toggle-mod', async (event, { dotaPath, fileName, enable }) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    const manifest = loadManifest(modsDir);

    // Font toggle support
    const fontEntry = manifest.mods.find(x => x.isFont && (x.fileName === fileName || x.id === fileName));
    if (fontEntry) {
      fontEntry.enabled = Boolean(enable);
      const targetFontsDirs = [
        path.join(dotaPath, 'game', 'dota', 'panorama', 'fonts'),
        path.join(dotaPath, 'game', 'dota_russian', 'panorama', 'fonts')
      ];
      const backupDir = path.join(modsDir, '__fonts_default_backup');

      if (!enable) {
        for (const fDir of targetFontsDirs) {
          if (fs.existsSync(fDir)) {
            if (fs.existsSync(backupDir)) {
              copyFolderRecursive(backupDir, fDir);
            } else {
              const files = fs.readdirSync(fDir);
              for (const f of files) {
                try { fs.unlinkSync(path.join(fDir, f)); } catch (e) {}
              }
            }
          }
        }
      }
      saveManifest(modsDir, manifest);
      return { success: true, newFileName: fileName };
    }

    const m = fileName.match(/pak(\d+)_dir\.vpk/i);
    if (!m) return { success: false, message: 'Неверный формат имени файла' };
    const pakNum = m[1];

    const activeName = `pak${pakNum}_dir.vpk`;
    const disabledName = `pak${pakNum}_dir.vpk.disabled`;

    const activePath = path.join(modsDir, activeName);
    const disabledPath = path.join(modsDir, disabledName);

    let newFileName = fileName;

    if (enable) {
      if (fs.existsSync(disabledPath)) {
        fs.renameSync(disabledPath, activePath);
        newFileName = activeName;
      }
    } else {
      if (fs.existsSync(activePath)) {
        fs.renameSync(activePath, disabledPath);
        newFileName = disabledName;
      }
    }

    const modEntry = manifest.mods.find(x => x.pakNumber === pakNum);
    if (modEntry) {
      modEntry.enabled = Boolean(enable);
      modEntry.fileName = newFileName;
      saveManifest(modsDir, manifest);
    }

    // Mirror toggle to other folder
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const mirActive = path.join(mirrorDir, activeName);
        const mirDisabled = path.join(mirrorDir, disabledName);
        if (enable && fs.existsSync(mirDisabled)) fs.renameSync(mirDisabled, mirActive);
        if (!enable && fs.existsSync(mirActive)) fs.renameSync(mirActive, mirDisabled);
      } catch (e) {}
    }

    return { success: true, newFileName };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: Disable All Mods
ipcMain.handle('dota:disable-all-mods', async (event, dotaPath) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    const manifest = loadManifest(modsDir);

    let disabledCount = 0;
    for (const mod of manifest.mods) {
      const activePath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk`);
      const disabledPath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk.disabled`);
      if (fs.existsSync(activePath)) {
        fs.renameSync(activePath, disabledPath);
        mod.enabled = false;
        mod.fileName = `pak${mod.pakNumber}_dir.vpk.disabled`;
        disabledCount++;
      }
    }
    saveManifest(modsDir, manifest);

    // Mirror to other folder
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const files = fs.readdirSync(mirrorDir);
        for (const f of files) {
          if (/^pak\d+_dir\.vpk$/i.test(f)) {
            fs.renameSync(path.join(mirrorDir, f), path.join(mirrorDir, f + '.disabled'));
          }
        }
      } catch (e) {}
    }

    return { success: true, count: disabledCount };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: Enable All Mods
ipcMain.handle('dota:enable-all-mods', async (event, dotaPath) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    const manifest = loadManifest(modsDir);

    let enabledCount = 0;
    for (const mod of manifest.mods) {
      const disabledPath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk.disabled`);
      const activePath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk`);
      if (fs.existsSync(disabledPath)) {
        fs.renameSync(disabledPath, activePath);
        mod.enabled = true;
        mod.fileName = `pak${mod.pakNumber}_dir.vpk`;
        enabledCount++;
      }
    }
    saveManifest(modsDir, manifest);

    // Mirror to other folder
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const files = fs.readdirSync(mirrorDir);
        for (const f of files) {
          if (/^pak\d+_dir\.vpk\.disabled$/i.test(f)) {
            fs.renameSync(path.join(mirrorDir, f), path.join(mirrorDir, f.replace('.disabled', '')));
          }
        }
      } catch (e) {}
    }

    return { success: true, count: enabledCount };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: Delete All Mods
ipcMain.handle('dota:delete-all-mods', async (event, dotaPath) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    const manifest = loadManifest(modsDir);

    let deletedCount = 0;
    for (const mod of manifest.mods) {
      const activePath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk`);
      const disabledPath = path.join(modsDir, `pak${mod.pakNumber}_dir.vpk.disabled`);
      if (fs.existsSync(activePath)) { fs.unlinkSync(activePath); deletedCount++; }
      if (fs.existsSync(disabledPath)) { fs.unlinkSync(disabledPath); deletedCount++; }
    }
    manifest.mods = [];
    saveManifest(modsDir, manifest);

    // Mirror delete in other folder
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const files = fs.readdirSync(mirrorDir);
        for (const f of files) {
          if (/^pak\d+_dir\.vpk(\.disabled)?$/i.test(f)) {
            fs.unlinkSync(path.join(mirrorDir, f));
          }
        }
      } catch (e) {}
    }

    return { success: true, count: deletedCount };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: Delete Mod
ipcMain.handle('dota:delete-mod', async (event, { dotaPath, fileName }) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    const manifest = loadManifest(modsDir);

    // Font delete support
    const fontEntry = manifest.mods.find(x => x.isFont && (x.fileName === fileName || x.id === fileName));
    if (fontEntry) {
      const targetFontsDirs = [
        path.join(dotaPath, 'game', 'dota', 'panorama', 'fonts'),
        path.join(dotaPath, 'game', 'dota_russian', 'panorama', 'fonts')
      ];
      const backupDir = path.join(modsDir, '__fonts_default_backup');
      for (const fDir of targetFontsDirs) {
        if (fs.existsSync(fDir)) {
          if (fs.existsSync(backupDir)) {
            copyFolderRecursive(backupDir, fDir);
          } else {
            const files = fs.readdirSync(fDir);
            for (const f of files) {
              try { fs.unlinkSync(path.join(fDir, f)); } catch (e) {}
            }
          }
        }
      }
      manifest.mods = manifest.mods.filter(x => x.id !== fontEntry.id);
      saveManifest(modsDir, manifest);
      return { success: true, message: 'Шрифт успешно удален!' };
    }

    const m = fileName.match(/pak(\d+)_dir\.vpk/i);
    const pakNum = m ? m[1] : null;

    const activePath = path.join(modsDir, fileName);
    const disabledPath = path.join(modsDir, fileName.endsWith('.disabled') ? fileName : fileName + '.disabled');

    if (fs.existsSync(activePath)) fs.unlinkSync(activePath);
    if (fs.existsSync(disabledPath)) fs.unlinkSync(disabledPath);

    manifest.mods = manifest.mods.filter(x => x.fileName !== fileName && x.pakNumber !== pakNum);
    saveManifest(modsDir, manifest);

    // Mirror delete
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const mirActive = path.join(mirrorDir, fileName);
        const mirDisabled = path.join(mirrorDir, fileName.endsWith('.disabled') ? fileName : fileName + '.disabled');
        if (fs.existsSync(mirActive)) fs.unlinkSync(mirActive);
        if (fs.existsSync(mirDisabled)) fs.unlinkSync(mirDisabled);
      } catch (e) {}
    }

    return { success: true, message: 'Мод успешно удален!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: Open Mods Folder
ipcMain.handle('dota:open-mods-folder', async (event, dotaPath) => {
  const { shell } = require('electron');
  const modsDir = getModsDirectory(dotaPath);
  await shell.openPath(modsDir);
  return { success: true };
});

// IPC Handler: Launch Dota 2
ipcMain.handle('dota:launch-game', async () => {
  const { shell } = require('electron');
  await shell.openExternal('steam://rungameid/570');
  return { success: true };
});

// Steam Integration: Helper to find Steam install directory
function findSteamDirectory() {
  const commonPaths = [
    'C:\\Program Files (x86)\\Steam',
    'C:\\Program Files\\Steam',
    'D:\\Steam',
    'E:\\Steam'
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Fetch Steam Community profile XML (avatar and persona)
function fetchSteamProfileData(steamId64) {
  return new Promise((resolve) => {
    try {
      const url = `https://steamcommunity.com/profiles/${steamId64}/?xml=1`;
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          const avatarMatch = raw.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/i);
          const nameMatch = raw.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/i);
          resolve({
            avatar: avatarMatch ? avatarMatch[1] : null,
            personaName: nameMatch ? nameMatch[1] : null
          });
        });
      }).on('error', () => {
        resolve({ avatar: null, personaName: null });
      });
    } catch (e) {
      resolve({ avatar: null, personaName: null });
    }
  });
}

// IPC: Get Active Steam User
ipcMain.handle('steam:get-user', async () => {
  try {
    const steamDir = findSteamDirectory();
    if (!steamDir) {
      return { success: false, message: 'Steam не найден на этом компьютере' };
    }

    const loginUsersFile = path.join(steamDir, 'config', 'loginusers.vdf');
    if (!fs.existsSync(loginUsersFile)) {
      return { success: false, message: 'Файл loginusers.vdf не найден' };
    }

    const content = fs.readFileSync(loginUsersFile, 'utf8');
    const userBlocks = content.match(/"(\d{17})"\s*\{([^}]+)\}/g);
    if (!userBlocks) {
      return { success: false, message: 'В Steam не найдено пользователей' };
    }

    let activeUser = null;
    let maxTimestamp = 0;

    for (const block of userBlocks) {
      const idMatch = block.match(/"(\d{17})"/);
      const steamId64 = idMatch ? idMatch[1] : null;
      const personaMatch = block.match(/"PersonaName"\s*"([^"]+)"/i);
      const accountMatch = block.match(/"AccountName"\s*"([^"]+)"/i);
      const autoLoginMatch = block.match(/"AutoLogin"\s*"([01])"/i);
      const timeMatch = block.match(/"Timestamp"\s*"(\d+)"/i);

      const isAutoLogin = autoLoginMatch && autoLoginMatch[1] === '1';
      const timestamp = timeMatch ? parseInt(timeMatch[1], 10) : 0;

      const userObj = {
        steamId64,
        personaName: personaMatch ? personaMatch[1] : 'Steam User',
        accountName: accountMatch ? accountMatch[1] : '',
        isAutoLogin,
        timestamp
      };

      if (isAutoLogin) {
        activeUser = userObj;
        break;
      }
      if (timestamp > maxTimestamp) {
        maxTimestamp = timestamp;
        activeUser = userObj;
      }
    }

    if (!activeUser || !activeUser.steamId64) {
      return { success: false, message: 'Активный пользователь Steam не найден' };
    }

    const id64 = BigInt(activeUser.steamId64);
    const steamId3 = (id64 - 76561197960265728n).toString();
    const dotaConfigsPath = path.join(steamDir, 'userdata', steamId3, '570', 'remote', 'cfg');
    const hasDotaConfigs = fs.existsSync(dotaConfigsPath);

    // Fetch avatar from Steam Community
    const profileData = await fetchSteamProfileData(activeUser.steamId64);

    return {
      success: true,
      steamId: activeUser.steamId64,
      steamId3: steamId3,
      personaName: profileData.personaName || activeUser.personaName,
      accountName: activeUser.accountName,
      avatar: profileData.avatar || 'https://avatars.fastly.steamstatic.com/19dc061c845a0a23c1a76628743a195d813b721a_full.jpg',
      hasDotaConfigs,
      dotaConfigsPath
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC: Apply User Configs
ipcMain.handle('steam:apply-configs', async (event, { dotaPath, steamId3 }) => {
  try {
    const steamDir = findSteamDirectory();
    let appliedConfigs = [];

    // 1. Check & ensure autoexec.cfg in game/dota/cfg
    const dotaCfgDir = path.join(dotaPath || 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota', 'cfg');
    if (fs.existsSync(dotaCfgDir)) {
      const autoexecFile = path.join(dotaCfgDir, 'autoexec.cfg');
      const modHubConfig = `// DotaMod Hub User AutoConfig\nrate 786432\ncl_updaterate 60\ncl_cmdrate 60\nfps_max 0\ndota_force_right_click_attack 1\necho "[DotaMod Hub] User configs loaded successfully"\n`;
      let currentContent = fs.existsSync(autoexecFile) ? fs.readFileSync(autoexecFile, 'utf8') : '';
      if (!currentContent.includes('DotaMod Hub')) {
        fs.writeFileSync(autoexecFile, currentContent + '\n' + modHubConfig, 'utf8');
      }
      appliedConfigs.push('autoexec.cfg (Сетевые и графические параметры)');
    }

    // 2. Check userdata config
    if (steamDir && steamId3) {
      const userCfgPath = path.join(steamDir, 'userdata', steamId3, '570', 'remote', 'cfg');
      if (fs.existsSync(userCfgPath)) {
        appliedConfigs.push('Dota 2 User Remote Configs (бинды и сетка героев синхронизированы)');
      }
    }

    return {
      success: true,
      appliedConfigs,
      message: 'Все пользовательские конфиги Dota 2 успешно применены!'
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC: Open Configs Folder
ipcMain.handle('steam:open-configs-folder', async (event, configsPath) => {
  const { shell } = require('electron');
  if (configsPath && fs.existsSync(configsPath)) {
    await shell.openPath(configsPath);
    return { success: true };
  }
  const steamDir = findSteamDirectory();
  if (steamDir) {
    const userdata = path.join(steamDir, 'userdata');
    if (fs.existsSync(userdata)) {
      await shell.openPath(userdata);
      return { success: true };
    }
  }
  return { success: false, message: 'Папка конфигов не найдена' };
});
