/**
 * 		Preload File
 * 		Exposes a chosen function to the "frontend"
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const { contextBridge, ipcRenderer } = require('electron')

// exposing function to frontend
contextBridge.exposeInMainWorld('com', {
	sendGrid: data => ipcRenderer.invoke('grid_ready', data)
})
