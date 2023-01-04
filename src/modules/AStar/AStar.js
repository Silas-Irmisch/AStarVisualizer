/**
 * 		Class containing main astar calculation functions
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Grid = require('../Grid/Grid.js')
const Graph = require('../Graph/Graph.js')
const Factory = require('./GraphFactory.js')
const Step = require('../Steps/StepData.js')
const StepType = require('../Steps/StepTypes.js')

module.exports = class AStar {
	//fields
	_graph
	_startVertex
	_endVertex
	_gridWidth
	_formula
	_tiebreaking

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
		this._formula = data.formula
		this._tiebreaking = data.tiebreaking
	}

	// executes AStar Algorithm
	// @return: Array of StepData-Objects
	execute() {
		let result = []

		let queue = [this._startVertex]
		let f_cost = new Map() // vertex -> priority as number
		let g_cost = new Map() // vertex -> cost as number
		let parent = new Map() // vertex -> vertex
		let visited = new Set() // vertex

		parent.set(this._startVertex, null)
		g_cost.set(this._startVertex, 0)
		result.push(new Step(StepType.INIT, null, [...queue], [...visited], null, null))

		while (queue.length > 0) {
			result.push(new Step(StepType.WHILE, null, [...queue], [...visited], null, null))
			let current = queue[0]
			result.push(new Step(StepType.CURRENT, current, [...queue], [...visited], null, null))

			// path found -> early exit
			result.push(new Step(StepType.IS_END, current, [...queue], [...visited], null, null))
			if (current == this._endVertex) {
				let path = this.retracePath(parent)
				result.push(new Step(StepType.PATH_FOUND, current, [...queue], [...visited], path, g_cost.get(this._endVertex)))
				return result
			}
			result.push(new Step(StepType.SET_VISITED, current, [...queue], [...visited], null, null))
			queue.splice(0, 1)
			visited.add(current)

			result.push(new Step(StepType.FOR_NB, current, [...queue], [...visited], null, null))
			let neighbors = this._graph.getNeighborsOfVertex(current)
			for (let index = 0; index < neighbors.length; index++) {
				let next = neighbors[index]

				result.push(new Step(StepType.VISITED, next, [...queue], [...visited], null, null))
				if (!visited.has(next)) {
					result.push(new Step(StepType.NEW_COST, next, [...queue], [...visited], null, null))
					let alt = g_cost.get(current) + this.getMoveCost(current, next)

					result.push(new Step(StepType.IS_GOOD, next, [...queue], [...visited], null, null))
					if (!queue.includes(next) || alt < g_cost.get(next)) {
						result.push(new Step(StepType.QUEUE_ADD, next, [...queue], [...visited], null, null))
						parent.set(next, current)
						g_cost.set(next, alt)
						f_cost.set(next, alt + this.getHCost(next))
						queue.push(next)
						queue.sort(function (v1, v2) {
							return f_cost.get(v1) - f_cost.get(v2)
						})
					}
				}
			}
		}
		// no path found
		result.push(new Step(StepType.NO_PATH, null, [...queue], [...visited], null, null))
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
	getHCost(vertex) {
		let coords1 = Factory.idToCoords(vertex._id, this._gridWidth)
		let coords2 = Factory.idToCoords(this._endVertex._id, this._gridWidth)
		let dx = Math.abs(coords1.x - coords2.x)
		let dy = Math.abs(coords1.y - coords2.y)
		let result = 1

		switch (this._formula) {
			case 'EUCLIDEAN':
				result = Math.sqrt(dx * dx + dy * dy)
				break
			case 'MANHATTAN':
				result = dx + dy
				break
			default:
				result = dx + dy
		}

		if (this._tiebreaking) result *= 1.5
		return result
	}
}
