/**
 * 		Preload File
 * 		Exposes a chosen function to the "frontend"
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const { contextBridge, ipcRenderer } = require('electron')

// when Frontend calls com.sendGrid(data), this invokes an event, that ipc.js will handle
contextBridge.exposeInMainWorld('com', {
	sendGrid: data => ipcRenderer.invoke('grid_ready', data)
})
