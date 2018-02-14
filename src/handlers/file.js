const {existsSync, createReadStream} = require('fs')
const {lookup} = require('mime-types')
const {root} = require('../helpers/path')

exports.serve = async function ({response, url}) {
	const filePath = root(url.pathname.substr(1))
	if (existsSync(filePath)) {
		const contentType = lookup(filePath) || 'application/octet-stream'
		response.setHeader('Content-Type', contentType)
		response.writeHead(200)
		createReadStream(filePath).pipe(response)
	} else {
		response.writeHead(404)
		response.end('File not found')
	}
}
