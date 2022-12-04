/** 	Grid Class of Graphs
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

const Cell = require('./Cell.js')

module.exports = class Grid {
	// fields
	width
	height
	grid
	scale

	// @params: width in int, height in int; both standard=10
	constructor(startPosition, endPosition, weights, scale, width = 10, height = 10) {
		this._width = width
		this._height = height
		this._grid = []
		this._scale = scale

		let sX = startPosition.x
		let sY = startPosition.y
		let eX = endPosition.x
		let eY = endPosition.y

		// fill 2DArray with Cells (standard weights)
		for (let i = 0; i < width; i++) {
			this._grid[i] = []
			for (let j = 0; j < height; j++) {
				this._grid[i][j] = new Cell(i, j, this.getWeight(weights[i][j]), sX == i && sY == j, eX == i && eY == j)
			}
		}
	}

	getWeight(weightString) {
		switch (weightString) {
			case 'WEIGHT1':
				return this._scale[0]
			case 'WEIGHT2':
				return this._scale[1]
			case 'WEIGHT3':
				return this._scale[2]
			case 'WEIGHT4':
				return this._scale[3]
			case 'WALL':
				return -1
		}
	}

	setWidth(width) {
		this._width = width
	}

	setHeight(height) {
		this._height = height
	}
}
