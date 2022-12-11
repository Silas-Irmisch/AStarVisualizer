/**
 * 		Class containing main astar calculation functions
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('../Grid/Grid.js')
const Graph = require('../Graph/Graph.js')
const Factory = require('./GraphFactory.js')
const Step = require('../../interfaces/StepData.js')
const StepType = require('../../interfaces/StepTypes.js')

module.exports = class AStar {
	//fields
	_graph
	_startVertex
	_endVertex
	_gridWidth
	// _avgWeight // is this needed for heuristic??

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
		// this._avgWeight = Factory.getAverageWeightOfGraph(this._graph)
	}

	// executes AStar Algorithm
	// @return: Array of StepData-Objects
	execute() {
		/***/ let result = []

		let open = [this._startVertex]
		let closed = []
		let priorities = new Map() // vertex -> priority as int
		let cameFrom = new Map() // vertex -> vertex
		let cost = new Map() // vertex -> cost as int

		cameFrom.set(this._startVertex, null)
		cost.set(this._startVertex, 0)

		/***/ result.push(new Step(StepType.INIT, null, [...open], [...closed], null, null))
		for (let openIndex = 0; open.length > 0; openIndex++) {
			/***/ result.push(new Step(StepType.WHILE, null, [...open], [...closed], null, null))

			let current = open[openIndex]
			/***/ result.push(new Step(StepType.CURRENT, current, [...open], [...closed], null, null))

			/***/ result.push(new Step(StepType.IS_END, current, [...open], [...closed], null, null))
			// path found -> early exit
			if (current == this._endVertex) {
				let path = this.retracePath(cameFrom)
				/***/ result.push(new Step(StepType.CALC_PATH, null, [...open], [...closed], path, cost.get(this._endVertex)))
				return result
			}

			closed.push(current)
			// open.splice(0, 1)
			/***/ result.push(new Step(StepType.CLOSED_ADD, current, [...open], [...closed], null, null))
			/***/ result.push(new Step(StepType.OPEN_REM, current, [...open], [...closed], null, null))

			let neighbors = this._graph.getNeighborsOfVertex(current)
			for (let index = 0; index < neighbors.length; index++) {
				let next = neighbors[index]
				/***/ result.push(new Step(StepType.FOR_NB, next, [...open], [...closed], null, null))

				let newCost = cost.get(current) + this.getMoveCost(current, next)
				/***/ result.push(new Step(StepType.NEW_COST, next, [...open], [...closed], null, null))

				/***/ result.push(new Step(StepType.CHECK_BETTER, next, [...open], [...closed], null, null))
				if (open.includes(next))
					if (newCost < cost.get(next)) {
						/***/ result.push(new Step(StepType.IS_BETTER, next, [...open], [...closed], null, null))
						open.splice(open.indexOf(next), 1)
					}

				/***/ result.push(new Step(StepType.IS_NEW, next, [...open], [...closed], null, null))
				if (!open.includes(next) && !closed.includes(next)) {
					cost.set(next, newCost)
					cameFrom.set(next, current)
					priorities.set(next, newCost + this.getHeuristic(next))
					open.push(next)
					open.sort(function (v1, v2) {
						return priorities.get(v1) - priorities.get(v2)
					})
					/***/ result.push(new Step(StepType.OPEN_ADD, next, [...open], [...closed], null, null))
				}
			}
		}
		// no path found
		/***/ result.push(new Step(StepType.NO_PATH, null, [...open], [...closed], null, null))
		return result
	}

	// @return: Array of Vertices in Order of Path
	// @params: cameFrom as Map (vertex -> vertex)
	retracePath(cameFrom) {
		let path = [this._endVertex]
		for (let i = 0; i < cameFrom.size; i++) {
			let prev = cameFrom.get(path[i])
			if (!prev) break // prev is null = startVertex Found
			path.push(prev)
		}
		return path.reverse()
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
		return Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y) //* this._avgWeight
	}
}
