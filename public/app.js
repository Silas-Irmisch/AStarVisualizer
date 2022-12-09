/**
 * 		Main Script
 * 		Frontend Setup Functions
 */

// reading Settings from config files
// Note: Files don't change in runtime so one-time-read is sufficient
import COLORS from '../config/Colors.json' assert { type: 'json' }
import SCALE from '../config/ScalePresets.json' assert { type: 'json' }

// defining limited amount of options for editing-strings
// not done per config-json, because that would imply that changing values is an option
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

// Const Settings: Gridsize
const GRID_WIDTH = 10 // should be 10
const GRID_HEIGHT = 10 // should be 10

// Canvas Setup, Global Canvas Settings
var ctx = document.getElementsByTagName('canvas')[0].getContext('2d')
ctx.lineWidth = 4
ctx.strokeStyle = COLORS.PATH

// Global Variables: Editing Mode
var _inProgress = false
var _editMode = true
var _editChoice = EDIT.WEIGHT1

// data to be sent to backend
var _startPosition = null
var _endPosition = null
// _weights-Array initializing: 2D-Array containing weight-strings
var _weights = Array(GRID_HEIGHT)
for (let i = 0; i < GRID_HEIGHT; i++) _weights[i] = Array(GRID_WIDTH).fill(EDIT.WEIGHT1)
// field with set weight values; initializing standard values 1,2,3,4
var _weightScale = SCALE.PRESET1

// resulting data from AStar-Progress
var _stepData = null
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
		newCell.style.border = '1px solid' + COLORS[EDIT.WEIGHT1]
		newCell.style.background = COLORS[EDIT.WEIGHT1]

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

// adding scale preset options to UI
let scaleUI = document.getElementById('scale_ui')
for (let i = 0; i < Object.keys(SCALE).length; i++) {
	let name = Object.keys(SCALE)[i]
	let number = name.split('PRESET')[1]
	let scale = SCALE[name]

	let newInput = document.createElement('input')
	newInput.type = 'radio'
	newInput.id = 'p' + number
	newInput.name = 'preset_elements'
	newInput.addEventListener('click', event => {
		radioButtonChoice(newInput)
	})
	if (i == 0) newInput.checked = true

	let newLabel = document.createElement('label')
	newLabel.for = 'p' + number
	newLabel.innerHTML = scale

	scaleUI.appendChild(newInput)
	scaleUI.appendChild(newLabel)
	scaleUI.appendChild(document.createElement('br'))
}

// called by button: toggling Editing-Phase On/Off
function toggleEditingMode() {
	if (!_editMode) {
		if (_inProgress) {
			// was in Progress. Alert -> setting=false, show correct button again
			alert('Quit?!')
			_inProgress = false
			document.getElementById('submit').hidden = false
			document.getElementById('next').hidden = true
			// clear drawn path and empty saved draw-data of context
			let canvas = document.getElementsByTagName('canvas')[0]
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.beginPath()
		}
		// changing button label and weight-choice interface visiblity
		document.getElementById('toggle_editingmode').innerHTML = "I'm done!"
		document.getElementById('edit_ui').style.display = 'block'
		document.getElementById('scale_ui').style.display = 'block'

		// toggle editMode-field on/off
		_editMode = !_editMode
	} else {
		// abort if start&end have not been set
		if (!_startPosition || !_endPosition || _startPosition == _endPosition) {
			alert('Please assign both a Starting and Ending Position!')
			return -1
		}
		// changing button label and weight-choice interface visiblity
		document.getElementById('toggle_editingmode').innerHTML = "Let's edit!"
		document.getElementById('edit_ui').style.display = 'none'
		document.getElementById('scale_ui').style.display = 'none'

		// toggle editMode-field on/off
		_editMode = !_editMode
	}
}

// called by weight-choice interface buttons, assigns weight-string to editChoice-field
// param: input-html-object, clicked by user
function radioButtonChoice(choiceHTMLObject) {
	let id = choiceHTMLObject.id
	if (id[0] == 'w') {
		// weight choice
		if (id[1] == 'a') {
			// wall
			_editChoice = EDIT.WALL
		} else {
			// weight 1-4
			_editChoice = EDIT['WEIGHT' + id[1]]
		}
	} else if (id[0] == 'p') {
		// preset choice
		_weightScale = SCALE['PRESET' + id[1]]
		updateUI()
	} else {
		// start
		if (id == 'start') _editChoice = EDIT.START
		else if (id == 'end') _editChoice = EDIT.END
		else _editChoice = EDIT.NONE
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
			cell.style.background = COLORS[EDIT.WEIGHT1]
			cell.style.borderColor = COLORS[EDIT.WEIGHT1]
			break
		case EDIT.WEIGHT2:
			cell.style.background = COLORS[EDIT.WEIGHT2]
			cell.style.borderColor = COLORS[EDIT.WEIGHT1]
			break
		case EDIT.WEIGHT3:
			cell.style.background = COLORS[EDIT.WEIGHT3]
			cell.style.borderColor = COLORS[EDIT.WEIGHT1]
			break
		case EDIT.WEIGHT4:
			cell.style.background = COLORS[EDIT.WEIGHT4]
			cell.style.borderColor = COLORS[EDIT.WEIGHT1]
			break
		case EDIT.WALL:
			// abort if cell is start/end
			if (cell.innerHTML !== '') return
			cell.style.background = COLORS[EDIT.WALL]
			cell.style.borderColor = COLORS[EDIT.WALL]
			break
	}

	_weights[cellX(cell.id)][cellY(cell.id)] = _editChoice
}

// called to ensure only one START and one END exist
// params: cellName-String; choice is either 'S' or 'E' to write in Cell
function replaceStartOrEnd(cellName, choice) {
	for (const cell of document.getElementById('grid').children) {
		if (cellName === cell.id) {
			cell.innerHTML = choice
			if (choice === 'S') _startPosition = cellName
			else _endPosition = cellName
		} else {
			if (cell.innerHTML == choice) cell.innerHTML = ''
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
function colorCellBorder(cellX, cellY, type) {
	let cell = document.getElementById('cell_' + cellX + '-' + cellY)
	if (type == 'OPEN') cell.style.borderColor = COLOR.OPEN
	else if (type == 'CLOSED') cell.style.borderColor = COLOR.CLOSED
	else throw 'EXCEPTION: colorCellBorder :: type is invalid.'
}

// called to start progress
function submitGraph() {
	// abort if in ediitng mode
	if (_editMode) {
		alert('You\'re in EDITING MODE!\n\nIf you\'re done editing, please confirm in the "Edit"-Tab!')
		return -1
	}
	// abort if start&end have not been set
	if (!_startPosition || !_endPosition || _startPosition == _endPosition) {
		alert('Please assign both a Starting and Ending Position!')
		return -1
	}

	// send data to backend
	com.sendGrid({
		startPosition: { x: cellX(_startPosition), y: cellY(_startPosition) },
		endPosition: { x: cellX(_endPosition), y: cellY(_endPosition) },
		weights: _weights,
		scale: _weightScale,
		gridWidth: GRID_WIDTH,
		gridHeight: GRID_HEIGHT
	}).then(res => {
		if (!res) throw 'EXCEPTION: Something went terribly wrong..  :('
		console.log('AStar: Results are in!')
		_stepData = res
	})

	// changing local settings and interface
	_inProgress = true
	document.getElementById('submit').hidden = true
	document.getElementById('next').hidden = false
	return 0
}

// requests the next step from backend
function nextStep() {
	// abort if in editing mode
	if (_editMode) {
		alert('You\'re in EDITING MODE!\n\nIf you\'re done editing, please confirm in the "Edit"-Tab!')
		return -1
	}

	// render Next Step
	console.log(_stepData)
	let path = _stepData[_stepData.length - 1]._path
	for (let i = 0; i < path.length - 1; i++) {
		let y = path[i]._id % GRID_WIDTH
		let x = (path[i]._id - y) / GRID_WIDTH
		let y2 = path[i + 1]._id % GRID_WIDTH
		let x2 = (path[i + 1]._id - y2) / GRID_WIDTH
		drawLine(y, x, y2, x2)
	}
}

// binding functions to html-window
window.radioButtonChoice = radioButtonChoice
window.toggleEditingMode = toggleEditingMode
window.submitGraph = submitGraph
window.nextStep = nextStep

// TESTING: calling functions
// drawLine(0, 0, 1, 0)
// colorCellBorder(1, 1, "OPEN")
