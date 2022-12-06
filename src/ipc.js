/**
 * 		File containing handlers for "messages" from frontend
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

// use ipcMain from electron
const { ipcMain } = require('electron')
const AStar = require('./modules/AStar.js')

// receiving grid data, calling Gridbuilder
ipcMain.on('grid_ready', (event, data) => {
	console.log('READY')
	let grid = AStar.buildGrid(data.startPosition, data.endPosition, data.weights, data.scale)
	// let graph = AStar.translateGridToGraph(grid)
	// console.log(graph._isDirected)
})

// receiving request for next step, calling AStar-functions and returning response to frontend
ipcMain.handle('next-step', event => {
	console.log('NEXT')
	return 0
})
