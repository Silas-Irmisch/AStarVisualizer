/**
 * 		Edge Class of Graphs
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 *  	Reference: ripphausen
 */

const V = require('./Vertex.js')

module.exports = class Edge {
	// fields
	_vertex1
	_vertex2
	_weight

	// @params: v1 as V, v2 as V, weight as number
	constructor(v1, v2, weight = 1.0) {
		this._vertex1 = v1
		this._vertex2 = v2
		// set weight to param; else standard is 1
		this._weight = weight
	}
}
