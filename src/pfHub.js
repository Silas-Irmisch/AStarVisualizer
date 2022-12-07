/**
 * 		Handlers for communication with frontend and Using AStar-functions
 * 		Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

// use ipcMain from electron
const { ipcMain } = require('electron')

const AStar = require('./modules/AStar.js')
const Grid = require('./modules/Grid/Grid.js')
const V = require('./modules/Graph/Vertex.js')

// initating AStar-Class
var astar = new AStar()

// receiving grid data, calling Gridbuilder
ipcMain.on('grid_ready', (event, data) => {
	console.log('READY')
	let grid = new Grid(data.weights, data.scale)
	astar.translateGridToGraph(grid)
	astar.setStartVertexFromCoords(data.startPosition.x, data.startPosition.y, data.gridWidth)
	astar.setEndVertexFromCoords(data.endPosition.x, data.endPosition.y, data.gridWidth)
})

let index = 0

// receiving request for next step, calling AStar-functions and returning response to frontend
ipcMain.handle('next-step', event => {
	console.log('NEXT')
	return astar.next(index++)
})
