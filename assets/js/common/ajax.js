function request(options) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest
		let requestBody = null
		let url = options.url

		xhr.open(options.method, url)

		if (options.headers) {
			const headers = options.headers
			for (const name in headers) {
				xhr.setRequestHeader(name, headers[name])
			}
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.responseText)
			} else {
				reject()
			}
		}

		xhr.send(requestBody)
		//$.ajax(...args)
		//    .done((data, textStatus, jqXHR) => {
		//        resolve({data, textStatus, jqXHR})
		//    })
		//    .fail((jqXHR, textStatus, error) => {
		//        reject({jqXHR, textStatus, error})
		//    })
	})
}

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
