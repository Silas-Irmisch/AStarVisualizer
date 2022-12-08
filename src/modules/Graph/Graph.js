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
	_isDirected
	// bool. =true if directed graph
	_vertexCount
	// int. amount of vertices
	_vertices
	// array. collection of vertices
	_adjList
	// array of arrays. adjancency lists of vertices (indices are consistent)
	_vertexIndex
	// map, int to int. maps vertex-ids to their position index in adjList

	// @params: isDirected as bool, vertices as Array, edges as Array
	constructor(isDirected, vertices, edges) {
		this._isDirected = isDirected
		this._vertexCount = 0
		this._vertices = []
		this._adjList = []
		this._vertexIndex = new Map()

		// early exit if vertices/edges missing
		// NOTE: constructor is only option to initialize/fill fields with data (2022-11-29)
		if (!vertices || !edges) return

		// initialize fields if vertices and edges are given
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

			// Append Edge e to Neighborhood
			this._adjList[vi1].push(e)
		}

		// If directed: done
		if (this._isDirected) return

		// additionally insert each edge in neighborhood of vertex2
		for (let i = 0; i < edges.length; i++) {
			let e = edges[i]
			let vi2 = this._vertexIndex.get(e._vertex2._id)
			// Append Edge e to Neighborhood
			this._adjList[vi2].push(e)
		}
	}

	// @return: Vertex from _vertices with id=param
	// @params: id as int
	getVertex(id) {
		let vid = this._vertexIndex.get(id)
		if (vid == null) return null
		return this._vertices[vid]
	}

	// @return: all edges of the Graph as Array
	getEdges() {
		let edges = []
		for (let i = 0; i < this._vertices.length; i++) {
			let v = this._vertices[i]
			let neighborEdges = this._adjList[this._vertexIndex.get(v._id)]

			for (let j = 0; j < neighborEdges.length; j++) {
				let e = neighborEdges[j]
				if (this._isDirected || (!this._isDirected && e._vertex1._id == v._id)) {
					edges.push(e)
				}
			}
		}
		return edges
	}

	// @return: adjacent vertices of vertex as Array
	// @params: vertex as V
	getNeighborsOfVertex(vertex) {
		return this.getNeighborsById(vertex._id)
	}

	// @return: adjacent vertices of vertex with id=param as Array
	// @params: id as int
	getNeighborsById(id) {
		let vi = this._vertexIndex.get(id)
		if (vi == null) return null

		let neighbors = []
		let neighborEdges = this._adjList[vi]
		for (let i = 0; i < neighborEdges.length; i++) {
			let e = neighborEdges[i]
			let v = e._vertex2
			if (v._id == id) {
				v = e._vertex1
			}
			neighbors.push(v)
		}
		return neighbors
	}

	// @return: incident edges of vertex as Array
	// @params: vertex as V
	getIncidentEdgesOfVertex(vertex) {
		return this.getIncidentEdgesById(vertex._id)
	}

	// @return: incident edges of vertex with id=param as Array
	// @params: id as int
	getIncidentEdgesById(id) {
		let vi = this._vertexIndex.get(id)
		if (vi == null) return null

		let edges = []
		for (let i = 0; i < this._adjList[vi].length; i++) {
			edges.push(this._adjList[vi][i])
		}
		return edges
	}

	// @return: edge(s) between vertex1 and vertex2
	// @params: vertex1 and vertex2 as V
	getEdgesBetweenVertices(vertex1, vertex2) {
		return this.getEdgesByIds(vertex1._id, vertex2._id)
	}

	// @return: edge(s) between vertex1 and vertex2 by ids
	// @params: id1 and id2 as int
	getEdgesByIds(id1, id2) {
		let v2id = this._vertexIndex.get(id2)
		if (v2id == null) return null

		let edges = []
		let incidentEdges = this.getIncidentEdgesById(id1)
		for (let i = 0; i < incidentEdges.length; i++) {
			let e = incidentEdges[i]
			if (e._vertex2._id == id2 || e._vertex1._id == id2) edges.push(e)
		}
		return edges
	}
}
