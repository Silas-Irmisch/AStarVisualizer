/**
 * 		Main File
 * 		Called on Application Startup
 * 		Creates Window and starts "Frontend"
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

// QuickStart: https://medium.com/@voltx180/a-beginners-guide-to-electron-js-1679fd7b6e4f

// require elements of electron
// import { app, BrowserWindow, Menu, MenuItem } from 'electron'
// import path from 'path'
const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const path = require('path')

// use local ipc.js, which handles communication with frontend
// import './ipc.js'
const ipc = require('./ipc.js')

// check if in dev mode
let dev = process.argv[2] == '--dev'

// Keep a global reference of the window object, in case of garbage collection
var window

// helps fix various issues. try reenabling when desperate..
app.disableHardwareAcceleration()

// Do when app is ready:
app.whenReady().then(() => {
	// define window parameters
	window = new BrowserWindow({
		width: 1100,
		minWidth: 1100,
		height: 550,
		minHeight: 550,
		maxHeight: 550,
		fullscreenable: false,
		webPreferences: {
			// setting preload file to be used
			preload: path.join(__dirname, './preload.js'),
			nodeIntegration: true,
			contextIsolation: true
		}
	})

	// define starting view: index.html
	window.loadFile(path.join(__dirname, '../public/index.html'))

	// remove Electron MenuBar; re-add Reload and Developer Console if in dev mode
	// https://dev.to/abulhasanlakhani/conditionally-appending-developer-tools-menuitem-to-an-existing-menu-in-electron-236k
	let newMenu = Menu.buildFromTemplate([])
	if (dev) {
		newMenu.append(
			new MenuItem({
				label: 'RELOAD',
				click: () => {
					window.reload()
				},
				accelerator: 'F5'
			})
		)
		newMenu.append(
			new MenuItem({
				label: 'DEVELOPER CONSOLE',
				click: () => {
					window.webContents.toggleDevTools()
				},
				accelerator: 'F12'
			})
		)
	}
	Menu.setApplicationMenu(newMenu)
})

// fully close app when all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
