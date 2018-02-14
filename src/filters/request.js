const {buffer, json} = require('micro')
const {parse: parseContentType} = require('content-type')
const {parse: parseQueryString} = require('qs')
const {parse: parseCookies} = require('cookie')
const {Form} = require('multiparty')
const {root} = require('../helpers/path')

const SIZE_10MB = 10 * 1024 * 1024
const SIZE_1MB = 1 * 1024 * 1024

exports.parseQuery = function (context) {
	if (context.url.search) {
		context.query = parseQueryString(context.url.search.substr(1))
	} else {
		context.query = {}
	}
}

exports.parseCookies = function (context) {
	let requestCookies = context.request.headers.cookie
	if (requestCookies === undefined) {
		context.cookies = {}
	} else if (Array.isArray(requestCookies)) {
		context.cookies = parseCookies(requestCookies[0])
	}
}

exports.parseBody = async function (context) {
	const contentTypeHeader = context.request.headers['content-type']
	let ret

	if (contentTypeHeader) {
		const contentType = parseContentType(contentTypeHeader)

		switch (contentType.type) {
		case 'application/json': {
			context.body = await json(context.request)
		} break

		case 'application/x-www-form-urlencoded': {
			const body = await buffer(context.request)
			context.body = parseQueryString(body)
		} break

		case 'multipart/form-data': {
			const form = new Form({
				uploadDir: root('upload'),
				autoFiles: true,
				autoFields: true,
				maxFields: 1000,
				maxFieldsSize: SIZE_1MB,
				maxFilesSize: SIZE_10MB,
			})
			ret = new Promise((resolve) => {
				form.parse(context.request, (err, fields, files) => {
					if (err) {
						switch (err.status) {
						case 413:
							context.respond('Payload Too Large', 413)
							break
						case 415:
							context.respond('Unsupported Media Type', 415)
							break
						default:
							context.respond('Internal Server Error', 500)
							break
						}
						return
					}
					resolve([fields, files])
				})
			}).then(([fields, files]) => {
				if (fields && files) {
					context.body = {fields, files}
				}
			})
		} break

		default:
			context.respond('Unsupported Media Type', 415)
			break
		}
	}

	return ret
}
