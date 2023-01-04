/**
 * 		Cell Class for Grids
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

module.exports = class Cell {
	// fields
	_x
	_y
	_weight

	// @params: x as number, y as number, weight in number (standard=1)
	constructor(x, y, weight = 1.0) {
		this._x = x
		this._y = y
		this._weight = weight
	}
}
