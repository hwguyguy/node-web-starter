const stringifyParams = require('qs/lib/stringify')
const serializeForm = require('form-serialize')

const HEADER_CONTENT_TYPE_REGEX = /\s*([\w/]+)\s*;?/

class AjaxError extends Error {
	constructor(message, client) {
		super(message)

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor)
		}

		// Support "instanceof" in ES5, not work on IE <= 10
		// if (typeof Object.setPrototypeOf === 'function') {
		// 	Object.setPrototypeOf(this, AjaxError.prototype)
		// }

		// Use duck typing instead of "instanceof" to support more browsers
		this._isAjaxError = true
		this.client = client
	}
}

function isAjaxError(error) {
	return error._isAjaxError
}

function getResponseContentType(client) {
	const header = client.getResponseHeader('Content-Type')
	if (!header) {
		return null
	}

	const matches = HEADER_CONTENT_TYPE_REGEX.exec(header)
	if (!matches) {
		return null
	}

	return matches[1]
}

function request(options) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest
		let requestBody = null
		let url = options.url
		const headers = options.headers || {}

		if (options.params) {
			const queryString = stringifyParams(options.params, {encode: false})
			if (queryString) {
				url += '?' + queryString
			}
		}

		if (options.data !== undefined) {
			if (options.data instanceof HTMLFormElement) {
				headers['Content-Type'] = 'application/x-www-form-urlencoded'
				requestBody = serializeForm(options.data)
			} else if (options.data instanceof FormData) {
				headers['Content-Type'] = 'multipart/form-data'
				requestBody = options.data
			} else {
				const dataType = typeof options.data
				switch (dataType) {
				case 'string':
					if (!headers['Content-Type']) {
						headers['Content-Type'] = 'text/plain'
					}
					break
				case 'object':
					headers['Content-Type'] = 'application/json'
					requestBody = JSON.stringify(options.data)
					break
				}
			}
		}

		xhr.open(options.method, url)

		for (const name in headers) {
			xhr.setRequestHeader(name, headers[name])
		}

		if (options.onUploadProgress) {
			xhr.upload.onprogress = options.onUploadProgress
		}

		if (options.onProgress) {
			xhr.onprogress = options.onProgress
		}

		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 300) {
					let responseData = this.responseText
					const contentType = getResponseContentType(this)

					if (contentType === 'application/json') {
						responseData = JSON.parse(responseData)
					}

					resolve({
						data: responseData,
						client: this,
					})
				} else {
					const message = options.method + ' ' + xhr.responseURL + ' ' + this.status
					reject(new AjaxError(message, xhr))
				}
			}
		}

		xhr.onerror = function () {
			const message = 'Error when connecting to ' + xhr.responseURL
			reject(new AjaxError(message, xhr))
		}

		xhr.send(requestBody)
	})
}

exports.isAjaxError = isAjaxError
exports.request = request

exports.get = function (url, config = {}) {
	return request({
		...config,
		url,
		method: 'GET',
	})
}

exports.post = function (url, data, config = {}) {
	return request({
		...config,
		url,
		data,
		method: 'POST',
	})
}
