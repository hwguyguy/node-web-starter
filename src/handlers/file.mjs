import fs from 'fs'
import mime from 'mime-types'
import {root} from '../helpers/path'

export function serve(context) {
	const filePath = root(context.url.pathname.substr(1))
	if (fs.existsSync(filePath)) {
		const contentType = mime.lookup(filePath) || 'application/octet-stream'
		const readStream = fs.createReadStream(filePath)
		context.response.setHeader('Content-Type', contentType)
		context.respond(readStream)
	} else {
		context.respond(null, 404)
	}
}
