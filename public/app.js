/**
 * 		Main Script
 * 		Frontend Setup Functions
 */

// defining limited amount of options for editing-strings
const EDIT = {
	NONE: 'NONE',
	START: 'START',
	END: 'END',
	WEIGHT1: 'WEIGHT1',
	WEIGHT2: 'WEIGHT2',
	WEIGHT3: 'WEIGHT3',
	WEIGHT4: 'WEIGHT4',
	WALL: 'WALL'
}

// defining Weight Scale preset values
const SCALE = {
	PRESET1: [1, 2, 3, 4],
	PRESET2: [1, 2, 4, 8],
	PRESET3: [1, 3, 9, 21]
}

// Const Settings: Gridsize and Colors
const GRID_WIDTH = 10 // standard 10
const GRID_HEIGHT = 10 // standard 10
const COLORMAP = new Map()
COLORMAP.set(EDIT.WEIGHT1, '#BBBBBB')
COLORMAP.set(EDIT.WEIGHT2, '#999999')
COLORMAP.set(EDIT.WEIGHT3, '#777777')
COLORMAP.set(EDIT.WEIGHT4, '#555555')
COLORMAP.set(EDIT.WALL, '#111111')

// Canvas Setup, Global Canvas Settings
var ctx = document.getElementsByTagName('canvas')[0].getContext('2d')
ctx.lineWidth = 4
ctx.strokeStyle = '#FFFFFF'

// Global Variables: Editing Mode
var _editMode = true
var _editChoice = EDIT.WEIGHT1

// data to be sent to backend
var _startLocation = null
var _endLocation = null
// _weights-Array initializing: 2D-Array containing weight-strings
var _weights = Array(GRID_HEIGHT)
for (let i = 0; i < GRID_HEIGHT; i++) _weights[i] = Array(GRID_WIDTH).fill(EDIT.WEIGHT1)
// field with set weight values; initializing standard values 1,2,3,4
var _weightScale = SCALE.PRESET1
// -----------------------------------------------------------------------------------------------------------------

// Grid Setup: find grid
const grid = document.getElementById('grid')

// setup grid according to SIZE-setting
grid.style.width = 40 * GRID_WIDTH + 'px'
grid.style.height = 40 * GRID_HEIGHT + 'px'
grid.style.gridTemplateColumns = 'repeat(' + GRID_WIDTH + ', 1fr)'
grid.style.gridTemplateRows = 'repeat(' + GRID_HEIGHT + ', 1fr)'

// populating grid with cells
for (let i = 0; i < GRID_WIDTH; i++) {
	for (let j = 0; j < GRID_HEIGHT; j++) {
		// Initializing grid_cell-Element with class, id, color
		let newCell = document.createElement('div')
		newCell.classList.add('grid_cell')
		newCell.setAttribute('id', 'cell_' + i + '-' + j)
		newCell.style.border = '1px solid' + COLORMAP.get(EDIT.WEIGHT1)
		newCell.style.background = COLORMAP.get(EDIT.WEIGHT1)

		// Handlers: Editing-Phase coloring of cell
		newCell.addEventListener('mousemove', event => {
			// for click and drags
			if (event.buttons == 1) setCellAttributes(newCell.id)
		})
		newCell.addEventListener('click', event => {
			// for single clicks
			setCellAttributes(newCell.id)
		})

		// Appending new Cell to the Grid-div
		grid.appendChild(newCell)
	}
}

// called by button: toggling Editing-Phase On/Off
// IMPORTANT: (missing feature) turning Editing On while A* Process started shouldnt work! or has consequences
function toggleEditingMode() {
	// toggle editMode-field on/off
	_editMode = !_editMode
	// changing button label and weight-choice interface visiblity
	if (_editMode) {
		document.getElementById('toggle_editingmode').innerHTML = "I'm done!"
		document.getElementById('edit_ui').style.display = 'block'
		document.getElementById('scale_ui').style.display = 'block'
	} else {
		document.getElementById('toggle_editingmode').innerHTML = "Let's edit!"
		document.getElementById('edit_ui').style.display = 'none'
		document.getElementById('scale_ui').style.display = 'none'
	}
}

// called by weight-choice interface buttons, assigns weight-string to editChoice-field
// param: input-html-object, clicked by user
function radioButtonChoice(choiceHTMLObject) {
	switch (choiceHTMLObject.id) {
		case 'w1':
			_editChoice = EDIT.WEIGHT1
			break
		case 'w2':
			_editChoice = EDIT.WEIGHT2
			break
		case 'w3':
			_editChoice = EDIT.WEIGHT3
			break
		case 'w4':
			_editChoice = EDIT.WEIGHT4
			break
		case 'wall':
			_editChoice = EDIT.WALL
			break
		case 'start':
			_editChoice = EDIT.START
			break
		case 'end':
			_editChoice = EDIT.END
			break
		case 'preset1':
			_weightScale = SCALE.PRESET1
			updateUI()
			break
		case 'preset2':
			_weightScale = SCALE.PRESET2
			updateUI()
			break
		case 'preset3':
			_weightScale = SCALE.PRESET3
			updateUI()
			break
	}
}

// updates the Weights listed in Editing Interface
function updateUI() {
	for (let i = 1; i <= 4; i++) document.getElementById('w' + i + '_l').innerHTML = _weightScale[i - 1]
}

// called by Clicking on Cell in Editing Phase
// colors cell according to chosen weight
function setCellAttributes(cellName) {
	if (!_editMode) return

	// find cell
	let cell = document.getElementById(cellName)
	switch (_editChoice) {
		case EDIT.START:
			if (_weights[cellX(cellName)][cellY(cellName)] === EDIT.WALL) break
			replaceStartOrEnd(cell.id, 'S')
			break
		case EDIT.END:
			if (_weights[cellX(cellName)][cellY(cellName)] === EDIT.WALL) break
			replaceStartOrEnd(cell.id, 'E')
			break
		default:
			applyWeightToCell(cell)
			break
	}
}

// assignes Colors to Cells and saves weight-choice to array global field
function applyWeightToCell(cell) {
	switch (_editChoice) {
		case EDIT.WEIGHT1:
			cell.style.background = COLORMAP.get(EDIT.WEIGHT1)
			cell.style.borderColor = COLORMAP.get(EDIT.WEIGHT1)
			break
		case EDIT.WEIGHT2:
			cell.style.background = COLORMAP.get(EDIT.WEIGHT2)
			cell.style.borderColor = COLORMAP.get(EDIT.WEIGHT1)
			break
		case EDIT.WEIGHT3:
			cell.style.background = COLORMAP.get(EDIT.WEIGHT3)
			cell.style.borderColor = COLORMAP.get(EDIT.WEIGHT1)
			break
		case EDIT.WEIGHT4:
			cell.style.background = COLORMAP.get(EDIT.WEIGHT4)
			cell.style.borderColor = COLORMAP.get(EDIT.WEIGHT1)
			break
		case EDIT.WALL:
			if (cell.innerHTML !== '') return
			cell.style.background = COLORMAP.get(EDIT.WALL)
			cell.style.borderColor = COLORMAP.get(EDIT.WALL)
			break
	}

	_weights[cellX(cell.id)][cellY(cell.id)] = _editChoice
}

// called to ensure only one START and one END exist
// params: cellName-String; s_e is either 'S' or 'E' to write in Cell
function replaceStartOrEnd(cellName, s_e) {
	for (const cell of document.getElementById('grid').children) {
		if (cellName === cell.id) {
			cell.innerHTML = s_e
			if (s_e === 'S') _startLocation = cellName
			else _endLocation = cellName
		} else {
			if (cell.innerHTML === s_e) cell.innerHTML = ''
		}
	}
}

// @params: cellName in String
// @return: cell coordinate X in String
function cellX(cellName) {
	return cellName.split('_')[1].split('-')[0]
}

// @params: cellName in String
// @return: cell coordinate Y in String
function cellY(cellName) {
	return cellName.split('_')[1].split('-')[1]
}

// function to draw a line between 2 cells
// should be called to payint in found path
function drawLine(startX, startY, endX, endY) {
	// cancel if out of bounds
	if (startX < 0 || startY < 0 || endX < 0 || endX < 0) return
	if (startX > 9 || startY > 9 || endX > 9 || endX > 9) return
	// cancel if line longer than 1
	if (endX - startX > 1 || endX - startX < -1 || endY - startY > 1 || endY - startY < -1) return
	// cancel if diagonal line
	if (endX - startX != 0 && endY - startY != 0) return

	ctx.moveTo(startX * 40 + 20, startY * 40 + 20)
	ctx.lineTo(endX * 40 + 20, endY * 40 + 20)

	// add line to canvas
	ctx.stroke()
}

// function to color cell border.
// will be called to mark Nodes in lists
function colorCellBorder(cellX, cellY, color) {
	let cell = document.getElementById('cell_' + cellX + '-' + cellY)
	cell.style.borderColor = color
}

// called to send data to backend
function submitGraph() {
	// TODO
	// check if start/end exist (_location), ..
	console.log(_weights)
	console.log('From ' + _startLocation + ' to ' + _endLocation)
}

// TESTING: calling functions
// drawLine(0, 0, 1, 0)
// drawLine(3, 3, 3, 4)
// colorCellBorder(1, 1, '#FF0000')
// colorCellBorder(3, 3, '#00FF00')
// colorCellBorder(5, 5, '#0000FF')
