/** 	Graph Class
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 *  	Reference: ripphausen
 */

/**
 *  	Methods for Adding and Removing Vertices and Edges have not been implemented.
 */

const V = require('./Vertex.js')
const E = require('./Edge.js')

module.exports = class Graph {
	// fields
	// bool. =true if directed graph
	_isDirected
	// int. amount of vertices
	_vertexCount
	// array. collection of vertices
	_vertices
	// array of arrays. adjancency lists of vertices (indices are consistent)
	_adjList
	// map, int to int. maps vertex-ids to their position index in adjList
	_vertexIndex

	// @params: isDirected as bool, vertices as Array, edges as Array
	constructor(isDirected, vertices, edges) {
		this._isDirected = isDirected
		this._vertexCount = 0
		this._vertices = []
		this._adjList = []
		this._vertexIndex = new Map()

		try {
			// initialize fields if vertices and edges are given
			// NOTE: constructor is only option to initialize/fill fields with data (2022-11-29)
			if (vertices && edges) {
				this._vertexCount = vertices.length

				// add vertices to _vertices and _vertexIndex; set _vertexCount
				for (let i = 0; i < vertices.length; i++) {
					let v = vertices[i]

					if (this._vertexIndex.has(v._id)) throw 'EXCEPTION: duplicate vertex-id'

					this._vertexIndex.set(v._id, i)
					this._vertices.push(v)
				}

				// Setting _adjList to correct size and initializing Arrays
				for (let i = 0; i < this._vertexCount; i++) this._adjList[i] = []

				// Add edges to _adjList
				for (let i = 0; i < edges.length; i++) {
					let e = edges[i]

					// check if vertices of edge e are known
					let vi1 = this._vertexIndex.get(e._vertex1._id)
					if (vi1 == null) throw 'EXCEPTION: Vertex1 of edge does not exist.'
					let vi2 = this._vertexIndex.get(e._vertex2._id)
					if (vi2 == null) throw 'EXCEPTION: Vertex2 of edge does not exist.'

					// Append Edge e to Neighbourhood
					this._adjList[vi1].push(e)
				}

				// If not directed: additionally insert each edge in neighbourhood of vertex2
				if (!this._isDirected) {
					for (let i = 0; i < edges.length; i++) {
						let e = edges[i]
						let vi2 = this._vertexIndex.get(e._vertex2._id)
						// Append Edge e to Neighbourhood
						this._adjList[vi2].push(e)
					}
				}
			}
		} catch (e) {
			console.log(e)
		}
	}

	// @return: Vertex from _vertices with id=param
	// @params: id as int
	getVertex(id) {
		let vid = this._vertexIndex.get(id)
		if (vid) {
			return this._vertices[vid]
		} else {
			return null
		}
	}

	// @return: all edges of the Graph as Array
	getEdges() {
		let edges = Array()
		for (const v in this._vertices) {
			let neighbourEdges = this._adjList[this._vertexIndex.get(v._id)]

			for (const e in neighbourEdges) {
				if (this._isDirected || (!this._isDirected && e._vertex1._id == v._id)) {
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

		let vi = this._vertexIndex.get(id)
		if (!vi) return null

		let neighbourEdges = this._adjList[vi]
		for (const e in neighbourEdges) {
			let v2 = e._vertex2
			if (b._id == id) {
				b = e._vertex1
			}
			neighbours.append(b)
		}
		return neighbours
	}

	// @return: incident edges of vertex as Array
	// @params: vertex as V
	getIncidentEdgesOfVertex(vertex) {
		return getIncidentEdgesById(vertex._id)
	}

	// @return: incident edges of vertex with id=param as Array
	// @params: id as int
	getIncidentEdgesById(id) {
		let edges = new List()

		let vi = this._vertexIndex.get(id)
		if (!vi) return null

		for (const e in this._adjList[vi]) {
			edges.append(e)
		}
		return edges
	}
}
