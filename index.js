const path = require('path')

const root = path.resolve(__dirname)
const runtimeDirectory = 'build'

require('source-map-support').install()

const {main} = require ('./' + runtimeDirectory)

main({
	root,
	runtimeDirectory,
})
