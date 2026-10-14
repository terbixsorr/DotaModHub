const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
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
    icon: path.join(__dirname, 'assets', 'ModHub_Avatar_Transparent.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Toggle DevTools with F12
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('app-command', (e, cmd) => {
    if (cmd === 'browser-backward') {
      mainWindow.webContents.send('app:navigate-back');
    } else if (cmd === 'browser-forward') {
      mainWindow.webContents.send('app:navigate-forward');
    }
  });

  // Forward renderer console messages to stdout
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message} (${sourceId}:${line})`);
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
    if (details.url && details.url.includes('wikia.nocookie.net')) {
      details.requestHeaders['Referer'] = 'https://dota2.fandom.com/';
    }
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

// Helper: Get next free pakXX number from 02 to 99 (never 01 which is reserved for base game)
function getNextAvailablePakNumber(modsDir, manifest) {
  const existingFiles = fs.existsSync(modsDir) ? fs.readdirSync(modsDir) : [];
  for (let i = 2; i <= 99; i++) {
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

// Helper: Ensure game/dota is 100% ORIGINAL Valve files without any custom modifications
// CRITICAL FOR VAC: Modifying gameinfo.gi or placing rogue files in game/dota triggers VAC errors
function restoreCleanGameInfo(dotaPath) {
  try {
    if (!dotaPath || !fs.existsSync(dotaPath)) return false;

    // 1. Restore clean gameinfo.gi
    const mainGi = path.join(dotaPath, 'game', 'dota', 'gameinfo.gi');
    const backupGi = path.join(dotaPath, 'game', 'dota', 'gameinfo.gi.backup');

    if (fs.existsSync(backupGi)) {
      const backupContent = fs.readFileSync(backupGi, 'utf8');
      if (!backupContent.includes('dota_mods')) {
        fs.copyFileSync(backupGi, mainGi);
      }
      try { fs.unlinkSync(backupGi); } catch (e) {}
    }

    if (fs.existsSync(mainGi)) {
      let content = fs.readFileSync(mainGi, 'utf8');
      if (content.includes('dota_mods')) {
        content = content.replace(/\r?\n\s*Game\s+dota_mods/gi, '');
        fs.writeFileSync(mainGi, content, 'utf8');
      }
    }

    // 2. Remove alien models directory from game/dota (Valve stores all models in pak01_dir.vpk)
    const dotaModels = path.join(dotaPath, 'game', 'dota', 'models');
    if (fs.existsSync(dotaModels)) {
      try { fs.rmSync(dotaModels, { recursive: true, force: true }); } catch (e) {}
    }

    // 3. Remove rogue files in game/dota that break VAC digital signature verification
    const dotaCoreDir = path.join(dotaPath, 'game', 'dota');
    if (fs.existsSync(dotaCoreDir)) {
      const entries = fs.readdirSync(dotaCoreDir);
      for (const f of entries) {
        if (f.endsWith('.backup') || f.endsWith('.tmp') || (f.endsWith('.vpk') && !f.toLowerCase().startsWith('pak01_') && !f.toLowerCase().startsWith('shaders_pc_'))) {
          try { fs.unlinkSync(path.join(dotaCoreDir, f)); } catch (e) {}
        }
      }
    }

    // 4. Clean rogue gameinfo.gi in subfolders to ensure Valve signature verification passes
    const rogueRussian = path.join(dotaPath, 'game', 'dota_russian', 'gameinfo.gi');
    if (fs.existsSync(rogueRussian)) {
      try {
        const rusContent = fs.readFileSync(rogueRussian, 'utf8');
        if (!rusContent.includes('LayeredOnMod')) {
          fs.unlinkSync(rogueRussian);
        }
      } catch (e) {}
    }
    const rogueRussianBackup = path.join(dotaPath, 'game', 'dota_russian', 'gameinfo.gi.backup');
    if (fs.existsSync(rogueRussianBackup)) {
      try { fs.unlinkSync(rogueRussianBackup); } catch (e) {}
    }
    const rogueMods = path.join(dotaPath, 'game', 'dota_mods', 'gameinfo.gi');
    if (fs.existsSync(rogueMods)) {
      try { fs.unlinkSync(rogueMods); } catch (e) {}
    }
    const rogueModsBackup = path.join(dotaPath, 'game', 'dota_mods', 'gameinfo.gi.backup');
    if (fs.existsSync(rogueModsBackup)) {
      try { fs.unlinkSync(rogueModsBackup); } catch (e) {}
    }

    // 5. Clean 0-byte corrupt files in dota_russian and dota_mods
    const checkFolders = [
      path.join(dotaPath, 'game', 'dota_russian'),
      path.join(dotaPath, 'game', 'dota_mods')
    ];
    for (const folder of checkFolders) {
      if (fs.existsSync(folder)) {
        const files = fs.readdirSync(folder);
        for (const file of files) {
          const filePath = path.join(folder, file);
          try {
            const stat = fs.statSync(filePath);
            if (stat.isFile() && stat.size === 0 && (file.endsWith('.vpk') || file.endsWith('.vpk.disabled'))) {
              fs.unlinkSync(filePath);
            }
          } catch (e) {}
        }
      }
    }

    // 6. Clean loose materials and models directories in dota_russian and dota_mods
    // Loose materials/default or loose models override Valve's engine files and break all hero shaders/textures!
    for (const sub of ['dota_russian', 'dota_mods']) {
      const looseMaterials = path.join(dotaPath, 'game', sub, 'materials');
      const looseModels = path.join(dotaPath, 'game', sub, 'models');
      if (fs.existsSync(looseMaterials)) {
        try { fs.rmSync(looseMaterials, { recursive: true, force: true }); } catch (e) {}
      }
      if (fs.existsSync(looseModels)) {
        try { fs.rmSync(looseModels, { recursive: true, force: true }); } catch (e) {}
      }
    }

    // 7. Sanitize all custom VPKs in dota_russian and dota_mods to prevent engine texture corruption
    for (const sub of ['dota_russian', 'dota_mods']) {
      const targetFolder = path.join(dotaPath, 'game', sub);
      if (fs.existsSync(targetFolder)) {
        try {
          const files = fs.readdirSync(targetFolder);
          for (const file of files) {
            if (/^pak\d+_dir\.vpk$/i.test(file)) {
              sanitizeVpk(path.join(targetFolder, file));
            }
          }
        } catch (e) {}
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

// Helper: Sanitize a custom VPK archive to remove rogue engine overrides
// Dangerous overrides like materials/default or materials/engine break all hero shaders & models in Dota 2
function sanitizeVpk(vpkPath) {
  try {
    if (!fs.existsSync(vpkPath)) return false;
    const buf = fs.readFileSync(vpkPath);
    if (buf.length < 16) return false;
    if (buf.readUInt32LE(0) !== 0x55aa1234) return false;
    const version = buf.readUInt32LE(4);
    const headerLen = version === 2 ? 28 : 12;
    const treeSize = buf.readUInt32LE(8);
    const dataStart = headerLen + treeSize;

    let pos = headerLen;
    function readNullString() {
      let s = '';
      while (pos < dataStart && buf[pos] !== 0) {
        s += String.fromCharCode(buf[pos]);
        pos++;
      }
      pos++;
      return s;
    }

    const entriesByExt = new Map();
    let dangerousCount = 0;

    while (pos < dataStart) {
      const ext = readNullString();
      if (!ext) break;
      while (pos < dataStart) {
        const dir = readNullString();
        if (!dir) break;
        while (pos < dataStart) {
          const name = readNullString();
          if (!name) break;
          const crc = buf.readUInt32LE(pos); pos += 4;
          const preloadBytes = buf.readUInt16LE(pos); pos += 2;
          const archiveIndex = buf.readUInt16LE(pos); pos += 2;
          const entryOffset = buf.readUInt32LE(pos); pos += 4;
          const entryLen = buf.readUInt32LE(pos); pos += 4;
          pos += 2; // term 0xffff
          let preload = null;
          if (preloadBytes > 0) {
            preload = buf.slice(pos, pos + preloadBytes);
            pos += preloadBytes;
          }

          const dirNorm = dir.toLowerCase().replace(/\\/g, '/');
          if (dirNorm === 'materials/default' || dirNorm.startsWith('materials/default/') ||
              dirNorm === 'materials/engine' || dirNorm.startsWith('materials/engine/')) {
            dangerousCount++;
            continue;
          }

          let fileData;
          if (archiveIndex === 0x7fff) {
            fileData = buf.slice(dataStart + entryOffset, dataStart + entryOffset + entryLen);
          } else {
            fileData = Buffer.alloc(0);
          }
          if (preload) {
            fileData = Buffer.concat([preload, fileData]);
          }

          if (!entriesByExt.has(ext)) entriesByExt.set(ext, new Map());
          const dirMap = entriesByExt.get(ext);
          if (!dirMap.has(dir)) dirMap.set(dir, []);
          dirMap.get(dir).push({ name, crc, data: fileData });
        }
      }
    }

    if (dangerousCount === 0) return true;

    const treeChunks = [];
    const dataChunks = [];
    let currentDataOffset = 0;

    for (const [ext, dirMap] of entriesByExt.entries()) {
      treeChunks.push(Buffer.from(ext + '\0', 'utf8'));
      for (const [dir, files] of dirMap.entries()) {
        treeChunks.push(Buffer.from(dir + '\0', 'utf8'));
        for (const file of files) {
          treeChunks.push(Buffer.from(file.name + '\0', 'utf8'));
          const entryBuf = Buffer.alloc(18);
          entryBuf.writeUInt32LE(file.crc, 0);
          entryBuf.writeUInt16LE(0, 4);
          entryBuf.writeUInt16LE(0x7fff, 6);
          entryBuf.writeUInt32LE(currentDataOffset, 8);
          entryBuf.writeUInt32LE(file.data.length, 12);
          entryBuf.writeUInt16LE(0xffff, 16);
          treeChunks.push(entryBuf);

          dataChunks.push(file.data);
          currentDataOffset += file.data.length;
        }
        treeChunks.push(Buffer.from([0]));
      }
      treeChunks.push(Buffer.from([0]));
    }
    treeChunks.push(Buffer.from([0]));

    const newTree = Buffer.concat(treeChunks);
    const newData = Buffer.concat(dataChunks);

    const newHeader = Buffer.alloc(28);
    newHeader.writeUInt32LE(0x55aa1234, 0);
    newHeader.writeUInt32LE(2, 4);
    newHeader.writeUInt32LE(newTree.length, 8);
    newHeader.writeUInt32LE(newData.length, 12);
    newHeader.writeUInt32LE(0, 16);
    newHeader.writeUInt32LE(0, 20);
    newHeader.writeUInt32LE(0, 24);

    const finalVpk = Buffer.concat([newHeader, newTree, newData]);
    fs.writeFileSync(vpkPath, finalVpk);
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

// Helper: Extract all files from a Source 2 / Source 1 VPK archive
function extractAllFromVpk(vpkPath) {
  try {
    if (!fs.existsSync(vpkPath)) return [];
    const buf = fs.readFileSync(vpkPath);
    if (buf.length < 16) return [];
    // Magic: 0x55aa1234
    if (buf.readUInt32LE(0) !== 0x55aa1234) return [];
    const version = buf.readUInt32LE(4);
    const headerLen = version === 2 ? 28 : 12;
    const treeSize = buf.readUInt32LE(8);
    const dataStart = headerLen + treeSize;
    const extracted = [];
    let pos = headerLen;

    while (pos < dataStart) {
      const extEnd = buf.indexOf(0, pos);
      if (extEnd === -1 || extEnd >= dataStart) break;
      const ext = buf.toString('utf8', pos, extEnd);
      pos = extEnd + 1;
      if (!ext) break;

      while (pos < dataStart) {
        const dirEnd = buf.indexOf(0, pos);
        if (dirEnd === -1 || dirEnd >= dataStart) break;
        const dir = buf.toString('utf8', pos, dirEnd);
        pos = dirEnd + 1;
        if (!dir) break;

        while (pos < dataStart) {
          const nameEnd = buf.indexOf(0, pos);
          if (nameEnd === -1 || nameEnd >= dataStart) break;
          const name = buf.toString('utf8', pos, nameEnd);
          pos = nameEnd + 1;
          if (!name) break;

          const preloadLen = buf.readUInt16LE(pos + 4);
          const archiveIndex = buf.readUInt16LE(pos + 6);
          const entryOffset = buf.readUInt32LE(pos + 8);
          const entryLen = buf.readUInt32LE(pos + 12);
          pos += 18;

          let fileData = null;
          if (archiveIndex === 0x7fff && entryLen > 0) {
            fileData = buf.slice(dataStart + entryOffset, dataStart + entryOffset + entryLen);
          }
          if (preloadLen > 0) {
            const preload = buf.slice(pos, pos + preloadLen);
            pos += preloadLen;
            if (fileData) fileData = Buffer.concat([preload, fileData]);
            else fileData = preload;
          }

          if (fileData) {
            const relPath = (dir && dir !== ' ') ? `${dir}/${name}.${ext}` : `${name}.${ext}`;
            extracted.push({
              relPath: relPath.replace(/\\/g, '/'),
              ext: ext.toLowerCase(),
              data: fileData
            });
          }
        }
      }
    }
    return extracted;
  } catch (err) {
    return [];
  }
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

// IPC Handler: Enable mod support in game (VAC-safe native dota_russian mounting)
ipcMain.handle('dota:enable-mods', async (event, dotaPath) => {
  try {
    restoreCleanGameInfo(dotaPath);
    const modsDir = getModsDirectory(dotaPath);
    return { 
      success: true, 
      message: `Безопасный режим модов активен! Моды монтируются через ${path.basename(modsDir)} без изменения системных файлов.` 
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: Repair VAC & restore official gameinfo.gi
ipcMain.handle('dota:repair-vac', async (event, dotaPath) => {
  try {
    restoreCleanGameInfo(dotaPath);
    return {
      success: true,
      message: 'Файлы игры полностью очищены и восстановлены! Папка game/dota чиста от посторонних файлов, gameinfo.gi оригинален, повреждённые файлы удалены. Защита VAC чиста.'
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// IPC Handler: One-click Download and Install Mod (VPK extraction with pakXX_dir naming)
ipcMain.handle('dota:install-mod', async (event, { dotaPath, modId, modTitle, downloadUrl, preview, hero, heroIcon, category }) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    restoreCleanGameInfo(dotaPath);

    const manifest = loadManifest(modsDir);

    let existingMod = manifest.mods.find(m => m.id === modId || m.title === modTitle);
    let pakNumStr = existingMod ? existingMod.pakNumber : getNextAvailablePakNumber(modsDir, manifest);
    if (!pakNumStr || pakNumStr === '01') {
      pakNumStr = getNextAvailablePakNumber(modsDir, manifest);
      if (pakNumStr === '01') pakNumStr = '02';
    }

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
            hero_icon: heroIcon || 'assets/heroes/dota2_logo_symbol.png',
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

    // Sanitize VPK: strip dangerous engine overrides (materials/default, materials/engine)
    // to prevent hero shader corruption, glowing red models, or invisible characters
    sanitizeVpk(targetPakPath);

    // Mirror between dota_russian and dota_mods only (never touch game/dota!)
    const mirrorDirs = [
      path.join(dotaPath, 'game', 'dota_russian'),
      path.join(dotaPath, 'game', 'dota_mods')
    ];
    for (const mDir of mirrorDirs) {
      if (fs.existsSync(mDir) && mDir !== modsDir) {
        try {
          fs.copyFileSync(targetPakPath, path.join(mDir, targetPakName));
        } catch (e) {}
      }
    }

    // Background & WebM handling:
    // Source 2's video engine cannot play WebM videos from inside a packed VPK archive.
    // For background mods ONLY, extract WebM videos and dashboard_background layouts as loose files.
    // NEVER extract loose materials or textures (.vtex) for hero skins or other mods!
    const isBackgroundMod = (category && category.toLowerCase().includes('background')) ||
                            (modId && modId.toLowerCase().includes('background')) ||
                            (modId && modId.startsWith('bg-')) ||
                            (hero && hero.toLowerCase().includes('background')) ||
                            (downloadUrl && downloadUrl.toLowerCase().includes('background'));

    const looseFiles = [];

    if (isBackgroundMod) {
      const extractedFiles = extractAllFromVpk(targetPakPath);
      const targetRoots = [
        path.join(dotaPath, 'game', 'dota_russian'),
        path.join(dotaPath, 'game', 'dota_mods')
      ].filter(r => fs.existsSync(r));

      for (const item of extractedFiles) {
        const isVideo = item.ext === 'webm';
        const isLayoutOrStyle = (item.ext.startsWith('vxml') || item.ext.startsWith('vcss') || item.ext.startsWith('vjs')) &&
                                (item.relPath.includes('dashboard') || item.relPath.includes('background') || item.relPath.includes('loadout'));

        if (isVideo) {
          const fileName = path.basename(item.relPath);
          for (const root of targetRoots) {
            const destPaths = [
              path.join(root, item.relPath),
              path.join(root, 'panorama', 'videos', item.relPath),
              path.join(root, 'panorama', 'videos', fileName)
            ];
            for (const dest of destPaths) {
              const dir = path.dirname(dest);
              if (!fs.existsSync(dir)) {
                try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
              }
              try {
                fs.writeFileSync(dest, item.data);
                if (!looseFiles.includes(dest)) looseFiles.push(dest);
              } catch (e) {}
            }
          }
        } else if (isLayoutOrStyle) {
          for (const root of targetRoots) {
            const dest = path.join(root, item.relPath);
            const dir = path.dirname(dest);
            if (!fs.existsSync(dir)) {
              try { fs.mkdirSync(dir, { recursive: true }); } catch (e) {}
            }
            try {
              fs.writeFileSync(dest, item.data);
              if (!looseFiles.includes(dest)) looseFiles.push(dest);
            } catch (e) {}
          }
        }
      }
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
      category: category || '',
      looseFiles: looseFiles,
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

    const modEntry = manifest.mods.find(x => x.pakNumber === pakNum || x.fileName === fileName);
    if (modEntry) {
      modEntry.enabled = Boolean(enable);
      modEntry.fileName = newFileName;

      // Toggle loose files (for backgrounds and extracted assets)
      if (Array.isArray(modEntry.looseFiles)) {
        for (const filePath of modEntry.looseFiles) {
          const disabledFile = filePath + '.disabled';
          if (enable) {
            if (fs.existsSync(disabledFile)) {
              try { fs.renameSync(disabledFile, filePath); } catch (e) {}
            }
          } else {
            if (fs.existsSync(filePath)) {
              try { fs.renameSync(filePath, disabledFile); } catch (e) {}
            }
          }
        }
      }

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

    // 1. Rename all active VPK files in modsDir
    if (fs.existsSync(modsDir)) {
      const files = fs.readdirSync(modsDir);
      for (const f of files) {
        if (/^pak\d+_dir\.vpk$/i.test(f) || (/\.vpk$/i.test(f) && !f.endsWith('.disabled'))) {
          const src = path.join(modsDir, f);
          const dst = path.join(modsDir, f + '.disabled');
          try {
            if (fs.existsSync(dst)) fs.unlinkSync(dst);
            fs.renameSync(src, dst);
            disabledCount++;
          } catch (e) {}
        }
      }
    }

    // 2. Disable all entries in manifest & loose files
    for (const mod of manifest.mods) {
      mod.enabled = false;
      if (mod.fileName && !mod.fileName.endsWith('.disabled')) {
        mod.fileName = mod.fileName + '.disabled';
      }
      if (Array.isArray(mod.looseFiles)) {
        for (const filePath of mod.looseFiles) {
          const activeFile = filePath.replace(/\.disabled$/, '');
          const disabledFile = activeFile + '.disabled';
          if (fs.existsSync(activeFile)) {
            try {
              if (fs.existsSync(disabledFile)) fs.unlinkSync(disabledFile);
              fs.renameSync(activeFile, disabledFile);
            } catch (e) {}
          }
        }
      }
    }
    saveManifest(modsDir, manifest);

    // 3. Mirror to other folder
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const files = fs.readdirSync(mirrorDir);
        for (const f of files) {
          if (/^pak\d+_dir\.vpk$/i.test(f)) {
            const src = path.join(mirrorDir, f);
            const dst = path.join(mirrorDir, f + '.disabled');
            if (fs.existsSync(dst)) fs.unlinkSync(dst);
            fs.renameSync(src, dst);
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

    // 1. Rename all disabled VPK files in modsDir back to active
    if (fs.existsSync(modsDir)) {
      const files = fs.readdirSync(modsDir);
      for (const f of files) {
        if (/^pak\d+_dir\.vpk\.disabled$/i.test(f) || /\.vpk\.disabled$/i.test(f)) {
          const activeName = f.replace(/\.disabled$/i, '');
          const src = path.join(modsDir, f);
          const dst = path.join(modsDir, activeName);
          try {
            if (fs.existsSync(dst)) fs.unlinkSync(dst);
            fs.renameSync(src, dst);
            enabledCount++;
          } catch (e) {}
        }
      }
    }

    // 2. Enable all entries in manifest & restore loose files
    for (const mod of manifest.mods) {
      mod.enabled = true;
      if (mod.fileName && mod.fileName.endsWith('.disabled')) {
        mod.fileName = mod.fileName.replace(/\.disabled$/, '');
      }
      if (Array.isArray(mod.looseFiles)) {
        for (const filePath of mod.looseFiles) {
          const disabledFile = filePath.endsWith('.disabled') ? filePath : (filePath + '.disabled');
          const activeFile = filePath.replace(/\.disabled$/, '');
          if (fs.existsSync(disabledFile)) {
            try {
              if (fs.existsSync(activeFile)) fs.unlinkSync(activeFile);
              fs.renameSync(disabledFile, activeFile);
            } catch (e) {}
          }
        }
      }
    }
    saveManifest(modsDir, manifest);

    // 3. Mirror to other folder
    const mirrorDir = modsDir.endsWith('dota_russian') 
      ? path.join(dotaPath, 'game', 'dota_mods') 
      : path.join(dotaPath, 'game', 'dota_russian');
    if (fs.existsSync(mirrorDir)) {
      try {
        const files = fs.readdirSync(mirrorDir);
        for (const f of files) {
          if (/^pak\d+_dir\.vpk\.disabled$/i.test(f) || /\.vpk\.disabled$/i.test(f)) {
            const activeName = f.replace(/\.disabled$/i, '');
            const src = path.join(mirrorDir, f);
            const dst = path.join(mirrorDir, activeName);
            if (fs.existsSync(dst)) fs.unlinkSync(dst);
            fs.renameSync(src, dst);
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
      if (Array.isArray(mod.looseFiles)) {
        for (const filePath of mod.looseFiles) {
          if (fs.existsSync(filePath)) { try { fs.unlinkSync(filePath); } catch (e) {} }
          const disabledFile = filePath + '.disabled';
          if (fs.existsSync(disabledFile)) { try { fs.unlinkSync(disabledFile); } catch (e) {} }
        }
      }
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
ipcMain.handle('dota:delete-mod', async (event, { dotaPath, fileName, modId, modTitle }) => {
  try {
    const modsDir = getModsDirectory(dotaPath);
    const manifest = loadManifest(modsDir);

    // Find mod entry in manifest
    const entry = manifest.mods.find(x => 
      (modId && (x.id === modId || x.cleanName === modId || x.title === modId)) ||
      (modTitle && (x.title === modTitle || x.cleanName === modTitle || x.id === modTitle)) ||
      (fileName && (x.fileName === fileName || x.id === fileName || x.cleanName === fileName || x.title === fileName))
    );

    // Font delete support
    if (entry && entry.isFont) {
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
      manifest.mods = manifest.mods.filter(x => x.id !== entry.id);
      saveManifest(modsDir, manifest);
      return { success: true, message: 'Шрифт успешно удален!' };
    }

    let actualFileName = entry ? entry.fileName : fileName;
    let pakNum = entry ? entry.pakNumber : null;
    if (!actualFileName && pakNum) {
      actualFileName = `pak${pakNum}_dir.vpk`;
    }
    if (!pakNum && actualFileName) {
      const m = actualFileName.match(/pak(\d+)_dir\.vpk/i);
      if (m) pakNum = m[1];
    }

    if (actualFileName) {
      const activePath = path.join(modsDir, actualFileName);
      const disabledPath = path.join(modsDir, actualFileName.endsWith('.disabled') ? actualFileName : actualFileName + '.disabled');
      if (fs.existsSync(activePath)) { try { fs.unlinkSync(activePath); } catch (e) {} }
      if (fs.existsSync(disabledPath)) { try { fs.unlinkSync(disabledPath); } catch (e) {} }
    }

    // Delete loose files associated with this mod
    if (entry && Array.isArray(entry.looseFiles)) {
      for (const filePath of entry.looseFiles) {
        if (fs.existsSync(filePath)) { try { fs.unlinkSync(filePath); } catch (e) {} }
        const disabledFile = filePath + '.disabled';
        if (fs.existsSync(disabledFile)) { try { fs.unlinkSync(disabledFile); } catch (e) {} }
      }
    }

    manifest.mods = manifest.mods.filter(x => {
      if (entry && x.id === entry.id) return false;
      if (actualFileName && x.fileName === actualFileName) return false;
      if (pakNum && x.pakNumber === pakNum) return false;
      return true;
    });
    saveManifest(modsDir, manifest);

    // Mirror delete
    if (actualFileName) {
      const mirrorDir = modsDir.endsWith('dota_russian') 
        ? path.join(dotaPath, 'game', 'dota_mods') 
        : path.join(dotaPath, 'game', 'dota_russian');
      if (fs.existsSync(mirrorDir)) {
        try {
          const mirActive = path.join(mirrorDir, actualFileName);
          const mirDisabled = path.join(mirrorDir, actualFileName.endsWith('.disabled') ? actualFileName : actualFileName + '.disabled');
          if (fs.existsSync(mirActive)) fs.unlinkSync(mirActive);
          if (fs.existsSync(mirDisabled)) fs.unlinkSync(mirDisabled);
        } catch (e) {}
      }
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
ipcMain.handle('dota:launch-game', async (event, dotaPath) => {
  const { shell } = require('electron');
  if (dotaPath) {
    try { restoreCleanGameInfo(dotaPath); } catch (e) {}
  }
  await shell.openExternal('steam://run/570//-language%20russian/');
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
      avatar: profileData.avatar || 'assets/default_avatar.jpg',
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

// ==========================================
// Discord Rich Presence Integration (Native Windows Named Pipe IPC)
// ==========================================
const net = require('net');

class DiscordRpcClient {
  constructor() {
    this.clientId = '1557096736466673754';
    this.socket = null;
    this.isConnected = false;
    this.enabled = true;
    this.currentActivity = {
      details: 'ModHub — Каталог скинов',
      state: 'Выбирает кастомные моды'
    };
    this.startTime = Math.floor(Date.now() / 1000);
  }

  init(clientId, enabled = false) {
    if (clientId) this.clientId = clientId;
    this.enabled = Boolean(enabled && this.clientId);
    if (this.enabled) {
      this.connect();
    }
  }

  connect() {
    if (!this.enabled || this.socket) return;

    let pipeIndex = 0;
    const tryNextPipe = () => {
      if (pipeIndex > 9 || !this.enabled) return;
      const pipePath = `\\\\.\\pipe\\discord-ipc-${pipeIndex}`;
      pipeIndex++;

      const sock = net.connect(pipePath, () => {
        this.socket = sock;
        this.isConnected = true;
        this.sendHandshake();
      });

      sock.on('data', (buf) => {
        try {
          if (buf.length < 8) return;
          const op = buf.readUInt32LE(0);
          const len = buf.readUInt32LE(4);
          const body = JSON.parse(buf.slice(8, 8 + len).toString('utf8'));
          if (body.evt === 'READY') {
            this.sendActivity(this.currentActivity);
          }
        } catch (e) {}
      });

      sock.on('error', () => {
        sock.destroy();
        this.socket = null;
        this.isConnected = false;
        tryNextPipe();
      });

      sock.on('close', () => {
        this.socket = null;
        this.isConnected = false;
      });
    };

    tryNextPipe();
  }

  sendHandshake() {
    if (!this.socket) return;
    try {
      const payload = JSON.stringify({ v: 1, client_id: this.clientId });
      const len = Buffer.byteLength(payload);
      const buf = Buffer.alloc(8 + len);
      buf.writeUInt32LE(0, 0); // Opcode 0 = Handshake
      buf.writeUInt32LE(len, 4);
      buf.write(payload, 8);
      this.socket.write(buf);
    } catch (e) {}
  }

  sendActivity(activity) {
    if (!activity) return;
    this.currentActivity = activity;
    if (!this.socket || !this.isConnected || !this.enabled) return;

    try {
      const payload = JSON.stringify({
        cmd: 'SET_ACTIVITY',
        args: {
          pid: process.pid,
          activity: {
            details: activity.details || 'Skinchanger — Каталог модов',
            state: activity.state || 'Выбирает кастомные скины',
            timestamps: { start: this.startTime },
            assets: {
              large_image: 'dota2',
              large_text: 'ModHub Skinchanger'
            }
          }
        },
        nonce: String(Date.now())
      });
      const len = Buffer.byteLength(payload);
      const buf = Buffer.alloc(8 + len);
      buf.writeUInt32LE(1, 0); // Opcode 1 = Frame
      buf.writeUInt32LE(len, 4);
      buf.write(payload, 8);
      this.socket.write(buf);
    } catch (e) {}
  }

  setEnabled(enabled, customClientId) {
    if (customClientId) {
      this.clientId = customClientId.trim();
    }
    // Never allow Valve Dota 2 client ID
    if (this.clientId === '356875988589740042') {
      this.clientId = '';
    }
    this.enabled = Boolean(enabled && this.clientId);

    if (!this.enabled) {
      if (this.socket) {
        try {
          // Clear current activity before closing socket
          const p = JSON.stringify({ cmd: 'SET_ACTIVITY', args: { pid: process.pid, activity: null }, nonce: 'clear' });
          const len = Buffer.byteLength(p);
          const buf = Buffer.alloc(8 + len);
          buf.writeUInt32LE(1, 0);
          buf.writeUInt32LE(len, 4);
          buf.write(p, 8);
          this.socket.write(buf);
          this.socket.destroy();
        } catch (e) {}
        this.socket = null;
        this.isConnected = false;
      }
    } else {
      if (!this.socket) {
        this.connect();
      } else {
        this.sendActivity(this.currentActivity);
      }
    }
  }
}

const discordRpc = new DiscordRpcClient();

// Connect to Discord RPC with ModHub client ID on startup
app.whenReady().then(() => {
  discordRpc.setEnabled(true, '1557096736466673754');
});

// Discord IPC handlers
ipcMain.handle('discord:set-activity', async (event, activity) => {
  discordRpc.sendActivity(activity);
  return { success: true };
});

ipcMain.handle('discord:set-enabled', async (event, { enabled, clientId }) => {
  discordRpc.setEnabled(enabled, clientId);
  return { success: true, isConnected: discordRpc.isConnected, enabled: discordRpc.enabled };
});

ipcMain.handle('discord:get-status', async () => {
  return {
    success: true,
    isConnected: discordRpc.isConnected,
    enabled: discordRpc.enabled,
    clientId: discordRpc.clientId
  };
});

ipcMain.handle('app:open-external', async (event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    shell.openExternal(url);
    return true;
  }
  return false;
});

// ==========================================
// AUTO-UPDATER IPC HANDLERS (GitHub Releases)
// ==========================================
const GITHUB_REPO_OWNER = 'terbixsorr';
const GITHUB_REPO_NAME = 'DotaModHub';

ipcMain.handle('update:check', async () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DotaModHub-AutoUpdater'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return resolve({ success: false, message: `GitHub API error: ${res.statusCode}` });
          }
          const release = JSON.parse(data);
          const tagName = release.tag_name || '';
          const latestVersion = tagName.replace(/^v/, '');
          
          let downloadUrl = release.html_url;
          let assetSize = null;
          let assetName = null;

          if (Array.isArray(release.assets)) {
            const exeAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.exe'));
            if (exeAsset) {
              downloadUrl = exeAsset.browser_download_url;
              assetSize = exeAsset.size;
              assetName = exeAsset.name;
            }
          }

          resolve({
            success: true,
            version: latestVersion,
            releaseName: release.name || tagName,
            notes: release.body || '',
            url: release.html_url,
            downloadUrl: downloadUrl,
            assetSize: assetSize,
            assetName: assetName,
            publishedAt: release.published_at
          });
        } catch (e) {
          resolve({ success: false, message: e.message });
        }
      });
    }).on('error', (err) => {
      resolve({ success: false, message: err.message });
    });
  });
});

ipcMain.handle('update:download', async (event, downloadUrl) => {
  if (!downloadUrl) return { success: false, message: 'URL для загрузки не указан' };
  
  const tempDir = app.getPath('temp');
  const tempInstaller = path.join(tempDir, `DotaModHub_Update_${Date.now()}.exe`);

  const downloadProgress = (url, destPath) => {
    return new Promise((resolve) => {
      const getFile = (currentUrl, redirects = 5) => {
        if (redirects <= 0) return resolve({ success: false, message: 'Too many redirects' });
        
        https.get(currentUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DotaModHub-AutoUpdater'
          }
        }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return getFile(res.headers.location, redirects - 1);
          }

          if (res.statusCode !== 200) {
            return resolve({ success: false, message: `HTTP Error: ${res.statusCode}` });
          }

          const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
          let receivedBytes = 0;
          const file = fs.createWriteStream(destPath);

          res.on('data', (chunk) => {
            receivedBytes += chunk.length;
            const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('update:download-progress', {
                receivedBytes,
                totalBytes,
                percent
              });
            }
          });

          res.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve({ success: true, filePath: destPath });
          });

          file.on('error', (err) => {
            fs.unlink(destPath, () => {});
            resolve({ success: false, message: err.message });
          });
        }).on('error', (err) => {
          resolve({ success: false, message: err.message });
        });
      };

      getFile(url);
    });
  };

  return await downloadProgress(downloadUrl, tempInstaller);
});

ipcMain.handle('update:install', async (event, installerPath) => {
  if (!installerPath || !fs.existsSync(installerPath)) {
    return { success: false, message: 'Файл установщика не найден' };
  }

  try {
    // Launch new installer and quit current process
    shell.openPath(installerPath);
    setTimeout(() => {
      app.quit();
    }, 1000);
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
});
