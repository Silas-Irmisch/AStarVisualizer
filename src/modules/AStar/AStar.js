/**
 * 		Class containing main astar calculation functions
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('../Grid/Grid.js')
const Graph = require('../Graph/Graph.js')
const Vertex = require('../Graph/Vertex.js')
const Edge = require('../Graph/Edge.js')
const Factory = require('./GraphFactory.js')

module.exports = class AStar {
	//fields
	_graph
	_startVertex
	_endVertex
	_gridWidth
	_avgWeight // is this needed fro heuristic??

	constructor(graph, startVertex, endVertex) {
		this._graph = graph
		this._startVertex = startVertex
		this._endVertex = endVertex
	}

	// setting up graph, start, end and width for aStar
	// @params: data as object
	SetupFromGrid(data) {
		this._graph = Factory.translateGridToGraph(new Grid(data.weights, data.scale))
		this._startVertex = this._graph.getVertex(Factory.coordinatesToId(data.startPosition.x, data.startPosition.y, data.gridWidth))
		this._endVertex = this._graph.getVertex(Factory.coordinatesToId(data.endPosition.x, data.endPosition.y, data.gridWidth))
		this._gridWidth = data.gridWidth
		this._avgWeight = Factory.getAverageWeightOfGraph(this._graph)
	}

	test() {
		try {
			let v1 = new Vertex(11)
			let v2 = new Vertex(12)
			let edges = this._graph.getEdgesBetweenVertices(v2, v1)
			console.log(edges)
		} catch (error) {
			console.log(error)
		}
	}

	instantAStar() {
		let open = [this._startVertex]
		let closed = []
		let priorities = new Map() // vertex -> priority as int
		let cameFrom = new Map() // vertex -> vertex
		let cost = new Map() // vertex -> cost as int

		cameFrom.set(this._startVertex, null)
		cost.set(this._startVertex, 0)

		while (open.length > 0) {
			let current = open[0]

			if (open[0] == this._endVertex) break

			closed.push(current)
			open.splice(0, 1)
			console.log(' > current: ' + current._id)

			let neighbors = this._graph.getNeighborsOfVertex(current)
			for (let index = 0; index < neighbors.length; index++) {
				let next = neighbors[index]
				console.log('  > next: ' + next._id)

				let newCost = cost.get(current) + this.getMoveCost(current, next)
				console.log('   > cost: ' + newCost)

				if (open.includes(next))
					if (newCost < cost.get(next)) {
						open.splice(open.indexOf(next), 1)
						console.log('    (next sliced)')
					}

				if (!open.includes(next) && !closed.includes(next)) {
					cost.set(next, newCost)
					cameFrom.set(next, current)
					priorities.set(next, newCost + this.getHeuristic(next))
					open.push(next)
					open.sort(function (v1, v2) {
						return priorities.get(v1) - priorities.get(v2)
					})

					console.log('   > next set up')
				}
			}
			console.log('>  End of ONE WhileCycle.')
		}
		console.log('#### WHILE EXITED ####')

		let path = [this._endVertex]
		for (let i = 0; i < cameFrom.size; i++) {
			let prev = cameFrom.get(path[i])
			if (!prev) break // prev is null = startVertex Found
			path.push(prev)
		}
		path.reverse()
		if (!path[0] == this._startVertex) return null

		console.log(path)
		return path
	}

	// @return: weight of edge between Vertices
	// @params: vertex1 and vertex2 as Vertex
	getMoveCost(vertex1, vertex2) {
		return this._graph.getEdgesBetweenVertices(vertex1, vertex2)[0]._weight
	}

	// @return: calculated heuristic cost from vertex to _endVertex
	// @params: vertex as Vertex-Object
	getHeuristic(vertex) {
		let coords1 = Factory.idToCoords(vertex._id, this._gridWidth)
		let coords2 = Factory.idToCoords(this._endVertex._id, this._gridWidth)
		// 4 directions movement -> Manhattan method
		return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y) * this._avgWeight
	}
}
