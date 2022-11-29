class Grid {
	// fields: 2DArray of GridNodes
	_grid

	constructor() {
		let sizeX = 10
		let sizeY = 10
		this._grid = new GridNode[sizeX][sizeY]()

		// fill 2DArray with Nodes
		for (let i = 0; i < sizeX; i++) {
			for (let j = 0; j < sizeY; j++) {
				grid[i][j] = new GridNode(i, j)
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
