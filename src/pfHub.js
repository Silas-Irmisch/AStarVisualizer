/**
 * 		Handlers for communication with frontend and Using AStar-functions
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

// use ipcMain from electron
const { ipcMain } = require('electron')

const AStar = require('./modules/AStar/AStar.js')

// initialize AStar;
var astar = new AStar()

// receiving grid data, calling Gridbuilder
ipcMain.handle('grid_ready', (event, data) => {
	console.log('ASTAR!')
	astar.SetupFromGrid(data)
	return astar.execute()
})

// receiving request for next step, calling AStar-functions and returning response to frontend
ipcMain.handle('next-step', event => {
	console.log('NEXT: nothing')
})
