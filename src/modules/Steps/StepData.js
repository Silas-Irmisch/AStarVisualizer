/**
 * 		Class for Objects containing Info about one "step" of A*
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const StepType = require('./StepTypes.js')

module.exports = class StepData {
	//fields
	_type
	_current
	_queue
	_visited
	_path

	// constructing Object
	// @params: type as string, queue and closed and path as Array, cost as number
	constructor(type, current, queue, visited, path, cost) {
		if (Object.values(StepType).indexOf(type) != -1) this._type = type
		else throw 'EXCEPTION: type is invalid'

		this._current = current
		this._queue = queue
		this._visited = visited
		this._path = { vertices: path, cost: cost }
	}
}
