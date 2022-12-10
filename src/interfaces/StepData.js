/**
 * 		Class containing Info about one "step" of A*
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const StepType = require('./StepTypes.js')

module.exports = class StepData {
	//fields
	_type
	_vertex
	_open
	_closed
	_path
	_cost

	// constructing Object
	// @params: type as string, open and closed and path as Array, cost as int
	constructor(type, vertex, open, closed, path, cost) {
		this._open = open
		this._vertex = vertex
		this._closed = closed
		this._path = path
		this._cost = cost

		if (Object.values(StepType).indexOf(type) != -1) this._type = type
		else throw 'EXCEPTION: type is invalid'
	}
}
