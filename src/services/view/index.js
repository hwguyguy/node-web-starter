const fs = require('mz/fs')
const readdir = require('recursive-readdir')
const {viewRoot} = require('./config')
const {createTemplate} = require('./precompiler')
const {render, addTemplate} = require('./renderer')

exports.render = render

exports.prepare = async function prepare() {
	const filePaths = await readdir(viewRoot())
	for (const filePath of filePaths) {
		const content = await fs.readFile(filePath, 'utf8')
		const template = createTemplate(content)
		addTemplate(filePath, template)
	}
}
