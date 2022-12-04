// QuickStart: https://medium.com/@voltx180/a-beginners-guide-to-electron-js-1679fd7b6e4f
// More Secure Approach (not in use!): https://stackoverflow.com/a/59888788

// require elements of electron
const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron')
const path = require('path')

// import local classes
const AStar = require('./modules/AStar.js')

// check if in dev mode
let dev = process.argv[2] == '--dev'

// Keep a global reference of the window object, in case of garbage collection
let window

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

// ipc Handlers (communication with "frontend"):
// receiving grid data
ipcMain.on('grid_ready', (event, data) => {
	console.out('READY')
	AStar.buildGrid(data.startPosition, data.endPosition, data.weights, data.scale)
})
ipcMain.on('next-step', event => {
	console.out('NEXT')
	AStar.getGrid()
})
