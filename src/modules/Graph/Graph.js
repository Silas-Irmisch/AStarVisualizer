/** 	Graph Class
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 *  	Reference: ripphausen
 */

/**
 *  	Methods for Adding and Removing Vertices and Edges have not been implemented.
 */

// const V = require('./Vertex.js')
// const E = require('./Edge.js')
import V from './Vertex.js'
import E from './Edge.js'

// https://www.npmjs.com/package/linked-list
import { Item } from 'linked-list'
// const { List, Item } = require('linked-list')

module.exports = class Graph {
	// fields
	// bool. =true if directed graph
	_isDirected
	// int. amount of vertices
	_vertexCount
	// array. collection of vertices
	_vertices
	// array of linkedlists. adjancency lists of vertices (indices are consistent)
	_adjList
	// map, int to int. maps vertex-ids to their position index in adjList
	_vertexIndex

	// @params: isDirected as bool, vertices as Array, edges as Array
	constructor(isDirected, vertices, edges) {
		this._isDirected = isDirected
		this._vertexCount = 0
		this._vertices = Array()
		this._adjList = Array()
		this._vertexIndex = Map()

		// initialize fields if vertices and edges are given
		// NOTE: constructor is only option to initialize/fill fields with data (2022-11-29)
		if (vertices && edges) {
			_vertexCount = vertices.length

			// add vertices to _vertices and _vertexIndex; set _vertexCount
			let i = 0
			for (const v in vertices) {
				if (_vertexIndex.has(v._id)) throw 'EXCEPTION: duplicate vertex-id'

				_vertexIndex.set(v._id, i++)
				_vertices.push(v)
				_vertexCount++
			}

			// Setting _adjList to correct size and initializing LinkedLists
			for (let j = 0; j < _vertexCount; j++) _adjList[j] = new List()

			// Add edges to _adjList
			for (const e in edges) {
				// check if vertices of edge e are known
				let vi1 = _vertexIndex.get(e._vertex1)
				if (!vi1) throw 'EXCEPTION: Vertex1 of edge does not exist.'
				let vi2 = _vertexIndex.get(e._vertex2)
				if (!vi2) throw 'EXCEPTION: Vertex2 of edge does not exist.'

				// Append Edge e to Neighbourhood
				_adjList[vi1].append(e)
			}

			// If not directed: additionally insert each edge in neighbourhood of vertex2
			if (!_isDirected) {
				for (const e in edges) {
					let vi2 = _vertexIndex.get(e._vertex2)
					// Append Edge e to Neighbourhood
					_adjList[vi2].append(e)
				}
			}
		}
	}

	// @return: Vertex from _vertices with id=param
	// @params: id as int
	getVertex(id) {
		let vid = _vertexIndex.get(id)
		if (vid) {
			return _vertices[vid]
		} else {
			return null
		}
	}

	// @return: all edges of the Graph as Array
	getEdges() {
		let edges = Array()
		for (const v in _vertices) {
			let neighbourEdges = _adjList[_vertexIndex.get(v._id)]

			for (const e in neighbourEdges) {
				if (_isDirected || (!_isDirected && e._vertex1._id == v._id)) {
					edges.push(e)
				}
			}
		}

		return edges
	}

	// @return: adjacent vertices of vertex as LinkedList
	// @params: vertex as V
	getNeighboursOfVertex(vertex) {
		return getNeighboursById(vertex._id)
	}

	// @return: adjacent vertices of vertex with id=param as LinkedList
	// @params: id as int
	getNeighboursById(id) {
		let neighbours = new List()

		let vi = _vertexIndex.get(id)
		if (!vi) return null

		let neighbourEdges = _adjList[vi]
		for (const e in neighbourEdges) {
			let v2 = e._vertex2
			if (b._id == id) {
				b = e._vertex1
			}
			neighbours.append(b)
		}
		return neighbours
	}

	// @return: incident edges of vertex as LinkedList
	// @params: vertex as V
	getIncidentEdgesOfVertex(vertex) {
		return getIncidentEdgesById(vertex._id)
	}

	// @return: incident edges of vertex with id=param as LinkedList
	// @params: id as int
	getIncidentEdgesById(id) {
		let edges = new List()

		let vi = _vertexIndex.get(id)
		if (!vi) return null

		for (const e in _adjList[vi]) {
			edges.append(e)
		}
		return edges
	}
}
