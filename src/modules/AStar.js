/**
 * 		Static Class containing main astar calculation functions
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('./Grid/Grid.js')

module.exports = class AStar {
	// fields
	static _grid
	static _graph

	static buildGrid(startPosition, endPosition, weights, scale, width = 10, height = 10) {
		this._grid = new Grid(startPosition, endPosition, weights, scale, width, height)
	}

	static getGrid() {
		return this._grid
	}
}
