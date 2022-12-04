const { contextBridge, ipcRenderer } = require('electron')

// testing preload
// source: https://electronjs.org
contextBridge.exposeInMainWorld('com', {
	sendGrid: data => ipcRenderer.send('grid_ready', data),
	nextStep: () => ipcRenderer.send('next-step')
})
