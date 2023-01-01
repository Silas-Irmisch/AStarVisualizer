/**
 * 		configure electron-forge to package build app as zip
 */

module.exports = {
	packagerConfig: {},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-zip'
		}
	]
}
