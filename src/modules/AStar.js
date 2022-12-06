/**
 * 		Static Class containing main astar calculation functions
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('./Grid/Grid.js')
const Graph = require('./Graph/Graph.js')
const Vertex = require('./Graph/Vertex.js')
const Edge = require('./Graph/Edge.js')

module.exports = class AStar {
	// build Grid from data in parameters
	// @params: startPosition and endPosition as Object(x in int, y in int), weights in 2DArray of ints, scale in Array(lenght=4), width and height in int
	// @return: grid as Grid-Object
	static buildGrid(startPosition, endPosition, weights, scale, width = 10, height = 10) {
		return new Grid(startPosition, endPosition, weights, scale, width, height)
	}

	// build Graph from data in parameters
	static buildGraph() {
		// not needed for BA Implementation: We always build from Grid
		throw 'EXCEPTION: function not implemented. Use translateGridToGraph() instead.'
	}

	// build Graph from Grid
	// @params: optional: call with separate grid, standard is data in _grid-field
	// @return: grpah as Graph-Object
	static translateGridToGraph(grid) {
		// Vertex-Array first
		let vertices = []
		for (let i = 0; i < grid._cells.length; i++) {
			for (let j = 0; j < grid._cells[i].length; j++) {
				let cell = grid._cells[i][j]
				let id = cell._x * grid._width + cell._y
				vertices.push(new Vertex(id))
			}
		}

		// this._graph = new Graph(false, [], [])
		// return this._graph
	}
}
