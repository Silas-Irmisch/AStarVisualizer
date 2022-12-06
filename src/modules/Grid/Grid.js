/** 	Grid Class of Graphs
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

// const Cell = require('./Cell.js')
import Cell from './Cell.js'

module.exports = class Grid {
	// fields
	_width
	_height
	_cells

	// @params: width in int, height in int; both standard=10
	constructor(startPosition, endPosition, weights, scale, width = 10, height = 10) {
		this._width = width
		this._height = height
		this._cells = []

		let sX = startPosition.x
		let sY = startPosition.y
		let eX = endPosition.x
		let eY = endPosition.y

		// fill 2DArray with Cells (standard weights)
		for (let i = 0; i < width; i++) {
			this._cells[i] = []
			for (let j = 0; j < height; j++) {
				this._cells[i][j] = new Cell(i, j, this.getWeight(scale, weights[i][j]), sX == i && sY == j, eX == i && eY == j)
			}
		}
	}

	// @params: scale as IntArray (length=4), weightString (ex. "WEIGHT1", .., "WALL")
	// @return: weight in int, -1 if not walkable
	getWeight(scale, weightString) {
		if (weightString == 'WALL') return -1
		else return scale[weightString[6] - 1]
	}

	setWidth(width) {
		this._width = width
	}

	setHeight(height) {
		this._height = height
	}
}
