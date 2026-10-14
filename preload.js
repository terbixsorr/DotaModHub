const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dotaManager', {
  detectPath: () => ipcRenderer.invoke('dota:detect-path'),
  browsePath: () => ipcRenderer.invoke('dota:browse-path'),
  enableMods: (dotaPath) => ipcRenderer.invoke('dota:enable-mods', dotaPath),
  installMod: (options) => ipcRenderer.invoke('dota:install-mod', options),
  listInstalledMods: (dotaPath) => ipcRenderer.invoke('dota:list-installed-mods', dotaPath),
  toggleMod: (options) => ipcRenderer.invoke('dota:toggle-mod', options),
  deleteMod: (options) => ipcRenderer.invoke('dota:delete-mod', options),
  openModsFolder: (dotaPath) => ipcRenderer.invoke('dota:open-mods-folder', dotaPath),
  disableAllMods: (dotaPath) => ipcRenderer.invoke('dota:disable-all-mods', dotaPath),
  enableAllMods: (dotaPath) => ipcRenderer.invoke('dota:enable-all-mods', dotaPath),
  deleteAllMods: (dotaPath) => ipcRenderer.invoke('dota:delete-all-mods', dotaPath),
  repairVac: (dotaPath) => ipcRenderer.invoke('dota:repair-vac', dotaPath),
  checkStatus: () => ipcRenderer.invoke('dota:check-status'),
  launchGame: (dotaPath) => ipcRenderer.invoke('dota:launch-game', dotaPath),
  getSteamUser: () => ipcRenderer.invoke('steam:get-user'),
  applyUserConfigs: (options) => ipcRenderer.invoke('steam:apply-configs', options),
  openConfigsFolder: (configsPath) => ipcRenderer.invoke('steam:open-configs-folder', configsPath),
  setDiscordActivity: (activity) => ipcRenderer.invoke('discord:set-activity', activity),
  setDiscordEnabled: (options) => ipcRenderer.invoke('discord:set-enabled', options),
  getDiscordStatus: () => ipcRenderer.invoke('discord:get-status'),
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),
  checkUpdate: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: (downloadUrl) => ipcRenderer.invoke('update:download', downloadUrl),
  installUpdate: (installerPath) => ipcRenderer.invoke('update:install', installerPath),
  onUpdateDownloadProgress: (callback) => {
    ipcRenderer.on('update:download-progress', (event, data) => {
      if (typeof callback === 'function') callback(data);
    });
  },
  onNavigateBack: (callback) => {
    ipcRenderer.on('app:navigate-back', () => {
      if (typeof callback === 'function') callback();
    });
  },
  onNavigateForward: (callback) => {
    ipcRenderer.on('app:navigate-forward', () => {
      if (typeof callback === 'function') callback();
    });
  }
});
