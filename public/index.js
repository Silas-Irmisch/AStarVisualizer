/**
 * 		This script handles purely visual content of index.html
 */

// fill Explanation-Tab with content
// TODO

// fell Help-Tab with content
// TODO

// @params: tabName in String
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
