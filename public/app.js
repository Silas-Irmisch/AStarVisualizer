/**
 * 		Main Script
 * 		Frontend Functions
 */

// reading Settings from config files
// Note: Files don't change in runtime so one-time-read is sufficient
import COLORS from '../config/Colors.json' assert { type: 'json' }
import SCALE from '../config/ScalePresets.json' assert { type: 'json' }

// importing StepTypes to compare types and EditStrings to compare with
import TYPE from './interfaces/StepTypes.json' assert { type: 'json' }
import EDIT from './interfaces/EditStrings.json' assert { type: 'json' }

// Const Settings: Gridsize
const GRID_WIDTH = 10 // should be 10
const GRID_HEIGHT = 10 // should be 10

const CELL_BORDER_WIDTH = 2

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
var _formulaChoice = null
var _tieBreaking = false

// resulting data from AStar-Progress
var _stepData = null
// current index of Step to be visualized
var _stepIndex = 0
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
		let size = 38 - 2 * CELL_BORDER_WIDTH
		newCell.style.width = size + 'px'
		newCell.style.height = size + 'px'
		newCell.style.border = CELL_BORDER_WIDTH + 'px solid' + COLORS[EDIT.WEIGHT1]
		newCell.style.borderRadius = '3px'
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
	newLabel.id = 'p' + number
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
			document.getElementById('prev').hidden = true
			document.getElementById('reset').hidden = true
			document.getElementById('skip').hidden = true
			// clear drawn path and empty saved draw-data of context
			clearGrid()
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
	if (id == 'wall') _editChoice = EDIT.WALL
	else if (id == 'start') _editChoice = EDIT.START
	else if (id == 'end') _editChoice = EDIT.END
	else if (id[0] == 'w')
		// --> weight 1-4
		_editChoice = EDIT['WEIGHT' + id[1]]
	else if (id[0] == 'p') {
		// --> preset
		_weightScale = SCALE['PRESET' + id[1]]
		// update the Weights listed in Editing Interface
		for (let i = 1; i <= 4; i++) document.getElementById('w' + i + '_l').innerHTML = _weightScale[i - 1]
	} else _editChoice = EDIT.NONE
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
			cell.style.borderColor = COLORS[EDIT.WEIGHT2]
			break
		case EDIT.WEIGHT3:
			cell.style.background = COLORS[EDIT.WEIGHT3]
			cell.style.borderColor = COLORS[EDIT.WEIGHT3]
			break
		case EDIT.WEIGHT4:
			cell.style.background = COLORS[EDIT.WEIGHT4]
			cell.style.borderColor = COLORS[EDIT.WEIGHT4]
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

// called to send Graph to Backend, receive result as StepData[] and changes button visibility
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
		gridHeight: GRID_HEIGHT,
		formula: _formulaChoice,
		tiebreaking: _tieBreaking
	}).then(res => {
		if (!res) throw 'EXCEPTION: Something went terribly wrong..  :('
		_stepData = res
		stepController(_stepData[0])
	})

	// changing local settings and interface
	_inProgress = true
	_stepIndex = 0
	document.getElementById('submit').hidden = true
	document.getElementById('next').hidden = false
	document.getElementById('prev').hidden = false
	document.getElementById('reset').hidden = false
	document.getElementById('skip').hidden = false
}

// called by button to show a step
function stepSwitchByDirection(direction) {
	// abort if in editing mode
	if (_editMode) {
		alert('You\'re in EDITING MODE!\n\nIf you\'re done editing, please confirm in the "Edit"-Tab!')
		return -1
	}

	// modify _stepIndex acording to direction
	switch (direction) {
		case 'prev':
			_stepIndex--
			break
		case 'next':
			_stepIndex++
			break
		case 'reset':
			_stepIndex = 0
			break
		case 'skip':
			_stepIndex = _stepData.length - 1
			break
	}

	if (_stepIndex >= _stepData.length || _stepIndex < 0) return
	stepController(_stepData[_stepIndex])
}

// calls showStep to color Borders and calls colorPseudo depending on the Type of Step
function stepController(step) {
	showStep(step._open, step._visited, step._current)
	switch (step._type) {
		case TYPE.INIT:
			colorPseudo([0, 1, 2, 3, 4])
			break
		case TYPE.WHILE:
			colorPseudo([6])
			break
		case TYPE.CURRENT:
			colorPseudo([7])
			break
		case TYPE.IS_END:
			colorPseudo([8])
			break
		case TYPE.PATH_FOUND:
			showPath(step._path)
			colorPseudo([9, 10])
			break
		case TYPE.SET_VISITED:
			colorPseudo([11, 12])
			break
		case TYPE.FOR_NB:
			colorPseudo([14])
			break
		case TYPE.VISITED:
			colorPseudo([15])
			break
		case TYPE.NEW_COST:
			colorPseudo([16])
			break
		case TYPE.IS_GOOD:
			colorPseudo([17])
			break
		case TYPE.OPEN_ADD:
			colorPseudo([18, 19, 20, 21])
			break
		case TYPE.NO_PATH:
			colorPseudo([23])
			break
	}
}

// clears the grid and then colors borders of cells as OPEN, CLOSED or specific VERTEX
function showStep(open, visited, current) {
	clearGrid()
	if (open) {
		for (let i = 0; i < open.length; i++) {
			let coords = idToCoords(open[i]._id)
			colorCellBorder(coords.x, coords.y, 'OPEN')
		}
	}
	if (visited) {
		for (let i = 0; i < visited.length; i++) {
			let coords = idToCoords(visited[i]._id)
			colorCellBorder(coords.x, coords.y, 'VISITED')
		}
	}
	if (current) {
		let coords = idToCoords(current._id)
		colorCellBorder(coords.x, coords.y, 'CURRENT')
	}
}

// colors lines of pseudo-code according to given indices
function colorPseudo(indices) {
	let lines = document.getElementsByClassName('pseudo_line')
	for (let i = 0; i < lines.length; i++) {
		lines[i].style.color = '#000000'
		if (indices.includes(i)) lines[i].style.color = '#FF0000'
	}
}

// iterates array and draws contained path
function showPath(path) {
	console.log('PATH COST: ' + path.cost)
	console.log('PATH LENGTH: ' + path.vertices.length)
	for (let i = 0; i < path.vertices.length - 1; i++) {
		let coords1 = idToCoords(path.vertices[i]._id)
		let coords2 = idToCoords(path.vertices[i + 1]._id)
		drawLine(coords1.y, coords1.x, coords2.y, coords2.x)
	}
}

// resets all BorderColors of Cells and drawn Path
function clearGrid() {
	let canvas = document.getElementsByTagName('canvas')[0]
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()

	let cells = document.getElementsByClassName('grid_cell')
	for (let i = 0; i < cells.length; i++) {
		cells[i].style.borderColor = cells[i].style.backgroundColor
	}
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
	document.getElementById('cell_' + cellX + '-' + cellY).style.borderColor = COLORS[type]
}

// binding functions to html-window
window.radioButtonChoice = radioButtonChoice
window.toggleEditingMode = toggleEditingMode
window.submitGraph = submitGraph
window.stepSwitchByDirection = stepSwitchByDirection

// ------------------------------------------------------------------------------------------------------------------------------------
// Helper-functions:

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

// @params: id and width as int
// @return: object containing x and y as int
function idToCoords(id) {
	let y = id % GRID_WIDTH
	let x = (id - y) / GRID_WIDTH
	return { x: x, y: y }
}
