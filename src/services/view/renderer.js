const path = require('path')
const {viewRoot} = require('./config')
const {env} = require('../../helpers/env')
const {translate, withLocale} = require('../../../locales')
const {url} = require('../../helpers/url')

const ENV = env()
const cachedTemplates = {}

exports.addTemplate = function addTemplate(filePath, template) {
	cachedTemplates[filePath] = template
}

function renderTemplate(fullPath, data) {
	if (fullPath.substr(-4) !== '.ejs') {
		fullPath += '.ejs'
	}

	const template = cachedTemplates[fullPath]

	if (!template) {
		if (ENV === 'development') {
			throw new Error('Cannot find precompiled template file ' + fullPath)
		} else {
			return ''
		}
	}

	if (template.meta && template.meta.layout) {
		return renderTemplate(viewRoot(template.meta.layout), {
			...data,
			_current: template.meta.layout,
			body: template(data)
		})
	}

	return template(data)
}

function include(file, data) {
	let filePath
	if (file.charAt(0) === '.') {
		filePath = viewRoot(path.dirname(this._current), file)
		console.log(this._current)
		console.log(filePath)
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

exports.render = function render(file, ctx, data = {}) {
	return renderTemplate(viewRoot(file), {
		...defaultData,
		t: withLocale(ctx.locale, translate),
		url: withLocale(ctx.locale, url),
		ctx,
		_template: file, // entry template
		_current: file, // current template
		...data,
	})
}
