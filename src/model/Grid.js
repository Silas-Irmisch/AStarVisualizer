class Grid {

	// fields: 2DArray of GridNodes
	private const GridNode[][] grid;

	constructor() {
		let sizeX = 10;
		let sizeY = 10;
		this.grid = new GridNode[sizeX][sizeY];

		console.out(":: Grid Ini:");
		// fill 2DArray with Nodes
		for(let i=0; i<sizeX; i++) {
			for(let j=0; j<sizeY; j++) {
				grid[i][j] = new GridNode(i, j);
				console.out(grid[i][j]._x +" -- "+ grid[i][j]._y)
			}
		}
	}
}