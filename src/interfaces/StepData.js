/**
 * 		Class containing Info about one "step" of A*
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const StepType = require('./StepTypes.js')

module.exports = class StepData {
	//fields
	_type
	_current
	_open
	_visited
	_path

	// constructing Object
	// @params: type as string, open and closed and path as Array, cost as int
	constructor(type, current, open, visited, path, cost) {
		if (Object.values(StepType).indexOf(type) != -1) this._type = type
		else throw 'EXCEPTION: type is invalid'

		this._current = current
		this._open = open
		this._visited = visited
		this._path = { vertices: path, cost: cost }
	}
}
