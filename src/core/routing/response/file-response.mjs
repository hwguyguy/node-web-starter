import fs from 'fs'
import mime from 'mime-types'
import Response from './response'

export default class FileResponse extends Response {
	constructor(filePath) {
		super()
		this.filePath = filePath
	}

	send(httpResponse) {
		if (fs.existsSync(this.filePath)) {
			const contentType = mime.lookup(this.filePath) || 'application/octet-stream'
			const readStream = fs.createReadStream(this.filePath)
			httpResponse.setHeader('Content-Type', contentType)
			this.data = readStream
			super.send(httpResponse)
		} else {
			this.status = 404
			super.send(httpResponse)
		}
	}
}
