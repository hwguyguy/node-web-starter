const {existsSync, createReadStream} = require('fs')
const {lookup} = require('mime-types')
const {root} = require('../helpers/path')

exports.serve = async function (context) {
	const filePath = root(context.url.pathname.substr(1))
	if (existsSync(filePath)) {
		const contentType = lookup(filePath) || 'application/octet-stream'
		const readStream = createReadStream(filePath)
		context.response.setHeader('Content-Type', contentType)
		context.respond(readStream)
	} else {
		context.respond(null, 404)
	}
}
