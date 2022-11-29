export default class GridNode {
	// fields: coordinates, weight
	_x
	_y
	_weight

	constructor(x, y, weight) {
		this._x = x
		this._y = y
		this._weight = weight
	}

	setWeight(weight) {
		_weight = weight
	}
}
