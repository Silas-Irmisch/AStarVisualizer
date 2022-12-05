/**
 * 		Preload File
 * 		Exposes a few chosen functions to the "client side"/"frontend"
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const { contextBridge, ipcRenderer } = require('electron')

// testing preload
// source: https://electronjs.org
contextBridge.exposeInMainWorld('com', {
	sendGrid: data => ipcRenderer.send('grid_ready', data),
	nextStep: () => ipcRenderer.invoke('next-step')
})
