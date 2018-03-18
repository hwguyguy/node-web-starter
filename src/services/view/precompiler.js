const ejs = require('ejs')
const {env} = require('../../helpers/env')

const ENV = env()

const META_PREFIX = '//'
const REGEXP_META_LINE = new RegExp('^' + META_PREFIX + '\\s*(\\w+)\\s*:(.*)$')

function getMeta(content) {
	let lines = content.split('\n')
	for (let i = 0, len = lines.length; i < len; ++i) {
		if (!lines[i].startsWith(META_PREFIX)) {
			lines.splice(i)
			break
		}
	}
	const meta = {}
	for (let i = 0, len = lines.length; i < len; ++i) {
		const matches = REGEXP_META_LINE.exec(lines[i])
		if (matches) {
			const key = matches[1]
			const value = matches[2]
			meta[key.trim()] = value.trim()
		}
	}
	return meta
}

function getContentWithoutMetaLines(content) {
	let lines = content.split('\n')
	for (let i = 0, len = lines.length; i < len; ++i) {
		if (!lines[i].startsWith(META_PREFIX)) {
			lines.splice(0, i)
			break
		}
	}
	return lines.join('\n')
}

exports.createTemplate = function createTemplate(content) {
	const meta = getMeta(content)
	const template =  ejs.compile(getContentWithoutMetaLines(content), {
		compileDebug: ENV === 'development',
		rmWhitespace: ENV === 'production',
	})
	template.meta = meta
	return template
}
