/** 	Grid Class of Graphs
 *  	Purpose: bachelor thesis
 *  	Author: silas irmisch
 */

import Cell from './Cell.js'

export default class Grid {
	// fields
	_width
	_height
	_grid

	// @params: width in int, height in int; both standard=10
	constructor(width = 10, height = 10) {
		this._width = width
		this._height = height
		this._grid = new Cell[_width][_height]()

		// fill 2DArray with Cells (standard weights)
		for (let i = 0; i < _width; i++) {
			for (let j = 0; j < _height; j++) {
				grid[i][j] = new Cell(i, j)
			}
		}
	}
}

/**
 *
 * 		add here(?):
 * 		functions to translate grid-info from frontend into Graph-Object
 *
 */
