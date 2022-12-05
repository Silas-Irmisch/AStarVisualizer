/** 	GridVertex Class of Graphs
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

export default class GridVertex extends Vertex {
	//fields
	_x
	_y
	_weight

	// @params: id in int, x in int, y in int, weight in float (standard=1)
	constructor(id, x, y, weight = 1.0) {
		super(id)
		this._x = x
		this._y = y
		this._weight = weight
	}
}
