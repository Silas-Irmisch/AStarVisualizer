/** 	Edge Class of Graphs
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 *  	Source: ripphausen
 */

import V from './Vertex.js'

// https://www.npmjs.com/package/linked-list
import { Item } from 'linked-list'

export default class Edge extends Item {
	// fields
	_vertex1
	_vertex2
	_weight

	// @params: v1 as V, v2 as V, weight as float
	constructor(v1, v2, weight) {
		this._vertex1 = v1
		this._vertex2 = v2
		// set weight to param OR to 1; depends if param given
		if (weight) this._weight = weight
		else this._weight = 1
	}
}
