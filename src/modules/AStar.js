/**
 * 		Class containing main astar calculation functions
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('./Grid/Grid.js')
const Graph = require('./Graph/Graph.js')
const Vertex = require('./Graph/Vertex.js')
const Edge = require('./Graph/Edge.js')

module.exports = class AStar {
	//fields
	_graph
	_startVertex
	_endVertex

	constructor(graph, startVertex, endVertex) {
		this._graph = graph
		this._startVertex = startVertex
		this._endVertex = endVertex
	}

	// build Graph from Grid
	// @params: optional: call with separate grid, standard is data in _grid-field
	// @return: grpah as Graph-Object
	translateGridToGraph(grid) {
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
				// if cell or neighbour (x-direction) is not wall: ignore
				if (cells[i][j]._weight == -1 || cells[i + 1][j]._weight == -1) continue
				// calculate weight
				let xWeight = Math.max(cells[i][j]._weight, cells[i + 1][j]._weight)
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
				// if cell or neighbour (y-direction) is not wall: ignore
				if (cells[i][j]._weight == -1 || cells[i][j + 1]._weight == -1) continue
				// calculate weight
				let yWeight = Math.max(cells[i][j]._weight, cells[i][j + 1]._weight)
				// find Vertices from Array and new Edge
				let yVertex1 = this.getVertexById(vertices, this.coordinatesToId(cells[i][j]._x, cells[i][j]._y, grid._width))
				let yVertex2 = this.getVertexById(vertices, this.coordinatesToId(cells[i][j + 1]._x, cells[i][j + 1]._y, grid._width))
				let yEdge = new Edge(yVertex1, yVertex2, yWeight)
				// add edge to array
				edges.push(yEdge)
			}
		}

		// construct Graph via Graph-Class and return it
		this._graph = new Graph(false, vertices, edges)
		return this._graph
	}

	// saves starting Vertex from coordinates
	// @params: x and y and gridWidth in int
	setStartVertexFromCoords(x, y, gridWidth) {
		let id = this.coordinatesToId(x, y, gridWidth)
		this._startVertex = new Vertex(id)
	}

	// saves ending Vertex from coordinates
	// @params: x and y and gridWidth in int
	setEndVertexFromCoords(x, y, gridWidth) {
		let id = this.coordinatesToId(x, y, gridWidth)
		this._endVertex = new Vertex(id)
	}

	// @params: x and y and width as int
	// @return: int
	coordinatesToId(x, y, width) {
		return x * width + y
	}

	// @params: vertices as Array of Vertex-Objects, id as int
	// @return: Vertex-Object
	getVertexById(vertices, id) {
		for (let i = 0; i < vertices.length; i++) {
			if (vertices[i]._id == id) return vertices[i]
		}
		throw 'EXCEPTION: No Vertex with id:' + id + ' known.'
	}

	/**
	 * 		OPEN = empty array
	 * 		CLOSED = empty array
	 * 		WHILE OPEN[0] != END:
	 * 			current = OPEN[0]
	 * 			CLOSED.push(current)
	 * 			foreach neighbour of current:
	 * 				cost = g(current) + movecost(current, neightbour)
	 * 				if OPEN.contains(neighbour) && cost < g(neighbour):
	 * 					remove neighbour from OPEN
	 * 				if not OPEN.contains(neighbour) && not CLOSED.contains(neighbour):
	 * 					g(neighbour) = cost
	 * 					OPEN.push(neighbour)
	 * 					(? set prio queue rank to g(neighbour)+h(neighbour) ?)
	 * 					neighbour.parent = current
	 *
	 * 		reconstruct reverse path from END to START (parent poinsters? )
	 */

	/* 
	first = () => {
		return '1'
	}
	second = () => {
		return '2'
	}
	third = () => {
		return '3'
	}
	_arr = [this.first, this.second, this.third]
	next(index) {
		return this._arr[index]()
	} 
	*/
}
