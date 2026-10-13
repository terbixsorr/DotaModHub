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
  checkStatus: () => ipcRenderer.invoke('dota:check-status'),
  launchGame: () => ipcRenderer.invoke('dota:launch-game'),
  getSteamUser: () => ipcRenderer.invoke('steam:get-user'),
  applyUserConfigs: (options) => ipcRenderer.invoke('steam:apply-configs', options),
  openConfigsFolder: (configsPath) => ipcRenderer.invoke('steam:open-configs-folder', configsPath)
});
