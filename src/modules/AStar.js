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

	// build Grid from data in parameters
	// @params: startPosition and endPosition as Object(x in int, y in int), weights in 2DArray of ints, scale in Array(lenght=4), width and height in int
	// @return: grid as Grid-Object
	static buildGrid(startPosition, endPosition, weights, scale, width = 10, height = 10) {
		this._grid = new Grid(startPosition, endPosition, weights, scale, width, height)
		return this._grid
	}

	// build Graph from data in parameters
	static buildGraph() {
		// not needed for BA Implementation: We always build from Grid
		throw 'EXCEPTION: function not implemented. Use translateGridToGraph() instead.'
	}

	// @return: Grid-Object
	static getGrid() {
		return this._grid
	}

	// build Graph from Grid
	// @params: optional: call with separate grid, standard is data in _grid-field
	// @return: grpah as Graph-Object
	static translateGridToGraph(grid = this._grid) {
		//
		//
		this._graph = new Graph(false, [], [])
		return this._graph
	}
}
