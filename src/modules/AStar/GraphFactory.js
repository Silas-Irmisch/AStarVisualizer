/**
 * 		static Class to translate a Grid into a Graph
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('../Grid/Grid.js')
const Graph = require('../Graph/Graph.js')
const Vertex = require('../Graph/Vertex.js')
const Edge = require('../Graph/Edge.js')

module.exports = class GraphFactory {
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
		// add edges in x-direction
		for (let i = 0; i < grid._width - 1; i++) {
			for (let j = 0; j < grid._height; j++) {
				// if cell or neighbor (x-direction) is not wall: ignore
				if (cells[i][j]._weight == -1 || cells[i + 1][j]._weight == -1) continue
				// calculate weight
				let xWeight = this.calculateEdgeWeight(cells[i][j]._weight, cells[i + 1][j]._weight)
				// find Vertices from Array and new Edge
				let xVertex1 = this.getVertexById(vertices, this.coordinatesToId(cells[i][j]._x, cells[i][j]._y, grid._width))
				let xVertex2 = this.getVertexById(vertices, this.coordinatesToId(cells[i + 1][j]._x, cells[i + 1][j]._y, grid._width))
				let xEdge = new Edge(xVertex1, xVertex2, xWeight)
				// add edge to array
				edges.push(xEdge)
			}
		}

		// same procedure for y direction
		for (let i = 0; i < grid._width; i++) {
			for (let j = 0; j < grid._height - 1; j++) {
				// if cell or neighbor (y-direction) is not wall: ignore
				if (cells[i][j]._weight == -1 || cells[i][j + 1]._weight == -1) continue
				// calculate weight
				let yWeight = this.calculateEdgeWeight(cells[i][j]._weight, cells[i][j + 1]._weight)
				// find Vertices from Array and new Edge
				let yVertex1 = this.getVertexById(vertices, this.coordinatesToId(cells[i][j]._x, cells[i][j]._y, grid._width))
				let yVertex2 = this.getVertexById(vertices, this.coordinatesToId(cells[i][j + 1]._x, cells[i][j + 1]._y, grid._width))
				let yEdge = new Edge(yVertex1, yVertex2, yWeight)
				// add edge to array
				edges.push(yEdge)
			}
		}

		// construct Graph via Graph-Class and return it
		return new Graph(false, vertices, edges)
	}

	// selects the greater of two weights to be the weight of the edge
	// @return: weight as int
	// @params: weight1 and weight2 as int
	static calculateEdgeWeight(weight1, weight2) {
		return Math.max(weight1, weight2)
	}

	// @return: the average Weight of all Edges of the graph
	// @params: graph as Graph
	static getAverageWeightOfGraph(graph) {
		let edges = graph.getEdges()
		let weightSum = 0
		for (let i = 0; i < edges.length; i++) {
			weightSum += edges[i]._weight
		}
		return weightSum / edges.length
	}

	// @params: x and y and width as int
	// @return: int
	static coordinatesToId(x, y, width) {
		return Number(x) * Number(width) + Number(y)
	}

	// @params: id and width as int
	// @return: object containing x and y as int
	static idToCoords(id, width) {
		let y = id % width
		let x = (id - y) / width
		return { x: x, y: y }
	}

	// @params: vertices as Array of Vertex-Objects, id as int
	// @return: Vertex-Object
	static getVertexById(vertices, id) {
		for (let i = 0; i < vertices.length; i++) {
			if (vertices[i]._id == id) return vertices[i]
		}
		throw 'EXCEPTION: No Vertex with id:' + id + ' known.'
	}
}
