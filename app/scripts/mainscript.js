// Grid Setup: populating Grid with Cells
const grid = document.getElementById('grid');
for(let i=0; i<10; i++) {
	for(let j=0; j<10; j++) {
		let newCell = document.createElement('div');
		newCell.classList.add('grid_cell');
		newCell.setAttribute('id', 'cell_'+ i +'-'+ j)
		newCell.addEventListener('mousemove', (event) => {
			// for click and drags
			if(event.buttons == 1) setCellAttributes(newCell.id)
		})
		newCell.addEventListener('click', (event) => {
			// for single clicks
			setCellAttributes(newCell.id)
		})

		grid.appendChild(newCell);
	}
}

var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
ctx.lineWidth = 4;
ctx.strokeStyle = '#FFFF00';

drawLine(0, 0, 1, 0);
colorCellBorder(1, 1, '#FF0000');
colorCellBorder(3, 3, '#00FF00');
colorCellBorder(5, 5, '#0000FF');

// settings
var editingMode = true;
var editWeight = 1;

function toggleEditingMode() {
	editingMode = !editingMode;
	if(editingMode) {
		document.getElementById('toggle_editingmode').innerHTML = "DONE";
		document.getElementById('weight_choice').style.display = 'block';
	} else {
		document.getElementById('toggle_editingmode').innerHTML = "EDIT";
		document.getElementById('weight_choice').style.display = 'none';
	}
}

function weightChoice(choice) {
	switch(choice.id) {
		case 'w1': editWeight = 1; break;
		case 'w2': editWeight = 2; break;
		case 'w3': editWeight = 3; break;
		case 'w4': editWeight = 4; break;
		case 'w5': editWeight = -1; break;
	}
}

function setCellAttributes(cellName) {
	if(!editingMode) return;

	// communicate with "backend"

	let cell = document.getElementById(cellName);
	cell.style.background = '#333333';
	switch(editWeight) {
		case 1: cell.style.background = '#BBBBBB'; break;
		case 2: cell.style.background = '#999999'; break;
		case 3: cell.style.background = '#777777'; break;
		case 4: cell.style.background = '#555555'; break;
		case -1: 
			cell.style.background = '#111111'; 
			cell.style.borderColor = '#111111';
			return;
	}
	cell.style.borderColor = '#BBBBBB';
}

function drawLine(startX, startY, endX, endY) {
	// cancel if out of bounds
	if(startX < 0 || startY < 0 || endX < 0 || endX < 0) return;
	if(startX > 9 || startY > 9 || endX > 9 || endX > 9) return;
	// cancel if line longer than 1
	if(endX - startX > 1 || endX - startX < -1 || endY - startY > 1 || endY - startY < -1) return;
	// cancel if diagonal line
	if(endX - startX != 0 && endY - startY != 0) return;
	
	ctx.moveTo((startX*40)+20, (startY*40)+20);
	ctx.lineTo((endX*40)+20, (endY*40)+20)

	// add line to canvas
	ctx.stroke();
}

function colorCellBorder(cellX, cellY, color) {
	let cell = document.getElementById('cell_'+ cellX +'-'+ cellY);
	cell.style.borderColor = color;
}

// function drawLine_webkit(startX, startY, endX, endY) {
// 	// cancel if out of bounds
// 	if(startX < 0 || startY < 0 || endX < 0 || endX < 0) return;
// 	if(startX > 9 || startY > 9 || endX > 9 || endX > 9) return;
// 	// cancel if line longer than 1
// 	if(endX - startX > 1 || endX - startX < -1 || endY - startY > 1 || endY - startY < -1) return;
// 	// cancel if diagonal line
// 	if(endX - startX != 0 && endY - startY != 0) return;

// 	let newLine = document.createElement('div');
// 	newLine.classList.add('line');
	
// 	if(endX == startX) {
// 		let pair = sortCoords(startY, endY);
// 		[startY, endY] = pair;

// 		let translateX = 20 + (startY*40);
// 		let translateY = -380 + (startY*40);
		
// 		// newLine.style.webkitTransform = 'translateY('+ translateY +') translateX('+ translateX +') rotate(0)';
// 	} else if(endY == startY) {
// 		let pair = sortCoords(startX, endX);
// 		[startX, endX] = pair;

// 		let translateX = 42 + (startX*40);
// 		let translateY = -367 + (startX*40);
		
// 		// newLine.style.webkitTransform = 'translateY('+ translateY +') translateX('+ translateX +') rotate(270)';
// 	} else return; // should never happen. already tested.
	
// 	// add element to grid
// 	document.getElementsByClassName('grid_container')[0].appendChild(newLine);
// }

// function sortCoords(start, end) {
// 	if(start <= end) return [start, end];
// 	else return [end, start];
// }

// temp test: drawing line via -webkit-transform
// let lineHor = document.createElement('div');
// let lineVer = document.createElement('div');
// lineHor.classList.add('line_hor');
// lineVer.classList.add('line_ver');
// document.getElementsByClassName('grid_container')[0].appendChild(lineHor);
// document.getElementsByClassName('grid_container')[0].appendChild(lineVer);