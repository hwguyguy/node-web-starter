import micro from 'micro'
import contentTypeParser from 'content-type'
import qs from 'qs'
import multiparty from 'multiparty'
import {root} from '../../../../helpers/path'

const SIZE_10MB = 10 * 1024 * 1024
const SIZE_1MB = 1 * 1024 * 1024

function parseMultipart(request) {
	const form = new multiparty.Form({
		uploadDir: root('upload'),
		autoFiles: true,
		autoFields: true,
		maxFields: 1000,
		maxFieldsSize: SIZE_1MB,
		maxFilesSize: SIZE_10MB,
	})
	return new Promise((resolve, reject) => {
		form.parse(request, (err, fields, files) => {
			if (err) {
				switch (err.status) {
				case 413:
					err.statusCode = 413
					err.messageBody = 'Payload Too Large'
					break
				case 415:
					err.statusCode = 415
					err.messageBody = 'Unsupported Media Type'
					break
				default:
					err.statusCode = 500
					err.messageBody = 'Internal Server Error'
					break
				}
				reject(err)
				return
			}
			resolve({fields, files})
		})
	})
}

export async function parseBody(request) {
	const contentTypeHeader = request.headers['content-type']
	let body = {}

	if (contentTypeHeader) {
		const contentType = contentTypeParser.parse(contentTypeHeader)

		switch (contentType.type) {
		case 'application/json': {
			body = await micro.json(request)
		} break

		case 'application/x-www-form-urlencoded': {
			const _body = await micro.buffer(request)
			body = qs.parse(_body)
		} break

		case 'multipart/form-data': {
			body = await parseMultipart(request)
		} break

		default: {
			const error = new Error('Unsupported Media Type')
			error.statusCode = 415
			error.messageBody = 'Unsupported Media Type'
			throw error
		}
		}
	}

	return body
}
