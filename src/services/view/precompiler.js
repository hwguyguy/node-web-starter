const ejs = require('ejs')
const {env} = require('../../helpers/env')

const ENV = env()

const META_PREFIX = '//'

function getMeta(content) {
	let lines = content.split('\n')
	for (let i = 0, len = lines.length; i < len; ++i) {
		if (!lines[i].startsWith(META_PREFIX)) {
			lines.splice(i)
			break
		}
	}
	lines = lines.map(line => line.substr(META_PREFIX.length))
	const meta = {}
	const re = /(.*?)(:.*)/
	for (let i = 0, len = lines.length; i < len; ++i) {
		const matches = re.exec(lines[i])
		const [key, value] = matches.slice(1, 3)
		meta[key.trim()] = value.substr(1).trim()
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
