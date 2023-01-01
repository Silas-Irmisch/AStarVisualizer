/**
 * 		This script handles the tab content of text tabs of index.html
 * 		Purpose: bachelor thesis
 *		Author: silas irmisch
 */

/* 
Source: reading text from file
https://forum.freecodecamp.org/t/load-local-text-file-with-js/83063/4
last access: 2023-01-01
*/

// fill PseudoCode-Tab with content
fetch('./content/pseudocode.txt')
	.then(res => res.text())
	.then(text => {
		let lines = text.split(/\r?\n/)

		let pseudoTab = document.getElementById('tab-pseudo')
		for (let i = 0; i < lines.length; i++) {
			let line = document.createElement('pre')
			line.classList.add('pseudo_line')
			line.innerHTML = lines[i]
			pseudoTab.appendChild(line)
		}
	})

// fill Explanation-Tab with content
fetch('./content/explanation.txt')
	.then(res => res.text())
	.then(text => {
		let paragraphs = text.split(/\r?\n/)

		let explainTab = document.getElementById('tab-explain')
		for (let i = 0; i < paragraphs.length; i++) {
			explainTab.innerHTML += '<br>' + paragraphs[i]
		}
	})

// fill Help-Tab with content
fetch('./content/help.txt')
	.then(res => res.text())
	.then(text => {
		let paragraphs = text.split(/\r?\n/)

		let helpTab = document.getElementById('tab-help')
		for (let i = 0; i < paragraphs.length; i++) {
			helpTab.innerHTML += '<br>' + paragraphs[i]
		}
	})

// @params: tabName in String
// shows selected tab and hides all other tabs
function selectTab(tabName) {
	let tabs = document.getElementsByClassName('tab')
	for (let i = 0; i < tabs.length; i++) {
		tabs[i].style.display = 'none'
	}
	let tabButtons = document.getElementsByClassName('tab-button')
	for (let i = 0; i < tabButtons.length; i++) {
		tabButtons[i].className = tabButtons[i].className.replace(' selected', '')
	}
	event.currentTarget.className += ' selected'
	document.getElementById(tabName).style.display = 'block'
}
