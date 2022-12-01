// QuickStart: https://medium.com/@voltx180/a-beginners-guide-to-electron-js-1679fd7b6e4f
// More Secure Approach (not in use!): https://stackoverflow.com/a/59888788

// require elements of electron
const {
	app,
	BrowserWindow
	// Menu
	// ipcMain,
	// dialog
} = require('electron')
const path = require('path')
// const fs = require('fs');

// ipcMain.handle('showDialog', (e, msg) => {
// 	dialog.showSaveDialog(filename => {
// 		fs.writeFileSync(filename + ".txt", msg, "utf-8", () => {
// 			console.log("attempted to write to the desktop");
// 		});
// 	});
// });

// Keep a global reference of the window object, in case of garbage collection
let window

// helps fix various issues. try reenabling when desperate..
app.disableHardwareAcceleration()

// Do when app is ready:
app.whenReady().then(() => {
	// define window parameters
	window = new BrowserWindow({
		width: 900,
		height: 550,
		minWidth: 900,
		minHeight: 550,
		frame: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	// define starting view: index.html
	window.loadFile(path.join(__dirname, '../app/views/index.html'))
	// set Menu Bar as per template
	// Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))
})

// template containing MenuItems
const mainMenuTemplate = []

// fully close app when all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
