class GridNode {

	// fields: coordinates, weight
	const int _x, 
	const int _y;
	const float _weight;

	// weight is initialized as 1, but changed by user in editing phase
	// walkable depends on set weight and chosen weight scale (max -> walkable=false)
	// because this class doesnt know scale: decide walkable elsewhere

	constructor(x: int, y: int) {
		this._x = x;
		this._y = y;
		this._weight = 1;
	}

	function setWeight(weight: float) {
		let w = _weight;
		this._weight = weight;
		console.out(":: Weight set from "+ w +" to "+ _weight);
	}
}