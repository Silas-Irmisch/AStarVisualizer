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
		// save cells for easier/shorter code
		let cells = grid._cells

		// Vertex-Array
		let vertices = []
		for (let i = 0; i < grid._width; i++) {
			for (let j = 0; j < grid._height; j++) {
				// ignore cell if wall
				if (cells[i][j]._weight == -1) continue
				// give every Vertex unique id, calculated from x,y
				// enables us to reconstruct coordinates in grid from id later
				let id = this.coordinatesToId(cells[i][j]._x, cells[i][j]._y, grid._width)
				vertices.push(new Vertex(id))
			}
		}
		// Edge-Array
		let edges = []
		for (let i = 0; i < grid._width - 1; i++) {
			for (let j = 0; j < grid._height - 1; j++) {
				// if cell or neighbour (x-direction) is not wall: add an edge
				if (cells[i][j]._weight != -1 && cells[i + 1][j]._weight != -1) {
					// calculate weight
					let xWeight = Math.max(cells[i][j]._weight, cells[i + 1][j]._weight)
					// new Edge
					let xVertex1 = vertices[this.coordinatesToId(cells[i][j]._x, cells[i][j]._y, grid._width)]
					let xVertex2 = vertices[this.coordinatesToId(cells[i + 1][j]._x, cells[i + 1][j]._y, grid._width)]
					let xEdge = new Edge(xVertex1, xVertex2, xWeight)
					// add edge to array
					edges.push(xEdge)
				}

				// same procedure for y direction
				// if cell or neighbour (y-direction) is not wall: add an edge
				if (cells[i][j]._weight != -1 && cells[i][j + 1]._weight != -1) {
					// calculate weight
					let yWeight = Math.max(cells[i][j]._weight, cells[i][j + 1]._weight)
					// new Edge
					let yVertex1 = vertices[this.coordinatesToId(cells[i][j]._x, cells[i][j]._y, grid._width)]
					let yVertex2 = vertices[this.coordinatesToId(cells[i][j + 1]._x, cells[i][j + 1]._y, grid._width)]
					let yEdge = new Edge(yVertex1, yVertex2, yWeight)
					// add edge to array
					edges.push(yEdge)
				}
			}
		}

		// construct Graph via GraphModule and return it
		return new Graph(false, vertices, edges)
	}

	// @params: x and y and width as int
	// @return: int
	static coordinatesToId(x, y, width) {
		return x * width + y
	}
}
