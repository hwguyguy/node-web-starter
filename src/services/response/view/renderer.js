const path = require('path')
const fs = require('mz/fs')
const readdir = require('recursive-readdir')
const ejs = require('ejs')
const {root} = require('../../../helpers/path')
const {env} = require('../../../helpers/env')

const ENV = env()
const viewRoot = root.bind(null, 'views')
let cache = {}

exports.precompileTemplates = async function precompileTemplates() {
	let filePaths = await readdir(viewRoot())

	for (let filePath of filePaths) {
		let content = await fs.readFile(filePath, 'utf8')
		cache[filePath] = ejs.compile(content, {
			rmWhitespace: ENV === 'production',
		})
	}
}

function renderTemplate(fullPath, data) {
	if (fullPath.substr(-4) !== '.ejs') {
		fullPath += '.ejs'
	}

	let template = cache[fullPath]

	if (template) {
		return template(data)
	}

	throw new Error('Cannot find precompiled template file ' + fullPath)
}

function include(file, data) {
	let filePath
	if (file.charAt(0) === '.') {
		filePath = viewRoot(path.dirname(this._current), file)
	} else {
		filePath = viewRoot(file)
	}

	return renderTemplate(filePath, {
		...this,
		...data,
		_current: filePath.replace(viewRoot() + '/', ''),
	})
}

const defaultData = {
	ENV,
	include,
}

exports.render = function render(file, data = {}) {
	data = {
		...defaultData,
		_template: file, // entry template
		_current: file, // current template
		...data,
	}

	let html = renderTemplate(viewRoot(file), data)

	if (data._layout) {
		data.body = html
		data._current = data._layout
		html = renderTemplate(viewRoot(data._layout), data)
	}

	return html
}
