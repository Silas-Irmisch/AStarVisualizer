/**
 * 		Handlers for communication with frontend and Using AStar-functions
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

// use ipcMain from electron
const { ipcMain } = require('electron')

const AStar = require('./modules/AStar/AStar.js')

// initating AStar-Class
var astar = new AStar()

// receiving grid data, calling Gridbuilder
ipcMain.on('grid_ready', (event, data) => {
	console.log('READY')
	astar.SetupFromGrid(data)
})

// receiving request for next step, calling AStar-functions and returning response to frontend
ipcMain.handle('next-step', event => {
	console.log('NEXT')
	// return astar.test()
	return astar.instantAStar()
})
