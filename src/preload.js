/**
 * 		Preload File
 * 		Exposes a chosen functions to the "client side"/"frontend"
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const { contextBridge, ipcRenderer } = require('electron')

// testing preload
// source: https://electronjs.org
contextBridge.exposeInMainWorld('com', {
	sendGrid: data => ipcRenderer.invoke('grid_ready', data)
})
