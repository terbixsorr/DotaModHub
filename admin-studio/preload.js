const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('adminAPI', {
  loadCatalog: (hubPath) => ipcRenderer.invoke('admin:load-catalog', hubPath),
  saveCatalog: (data) => ipcRenderer.invoke('admin:save-catalog', data),
  scanIncomingFolder: (folderPath) => ipcRenderer.invoke('admin:scan-incoming', folderPath),
  inspectFile: (filePath) => ipcRenderer.invoke('admin:inspect-file', filePath),
  checkGitHubNewMods: (data) => ipcRenderer.invoke('admin:check-github', data),
  publishToGitHub: (data) => ipcRenderer.invoke('admin:publish-github', data),
  selectDirectory: (defaultPath) => ipcRenderer.invoke('admin:select-directory', defaultPath),
  selectFile: (filters) => ipcRenderer.invoke('admin:select-file', filters),
  openFolderInExplorer: (targetPath) => ipcRenderer.invoke('admin:open-folder', targetPath),
  testUrl: (url) => ipcRenderer.invoke('admin:test-url', url),
  copyFileToHub: (data) => ipcRenderer.invoke('admin:copy-file', data),
  getAppPaths: () => ipcRenderer.invoke('admin:get-app-paths'),
  showNotification: (data) => ipcRenderer.invoke('admin:show-notification', data),
  focusWindow: () => ipcRenderer.invoke('admin:focus-window'),
  onIncomingChanged: (callback) => ipcRenderer.on('admin:incoming-changed', (event, data) => callback(data)),
  onTriggerCheck: (callback) => ipcRenderer.on('admin:trigger-check', () => callback()),
  onSwitchTab: (callback) => ipcRenderer.on('admin:switch-tab', (event, tab) => callback(tab))
});
