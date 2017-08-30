function request(...args) {
	return new Promise((resolve, reject) => {
		$.ajax(...args)
			.done((data, textStatus, jqXHR) => {
				resolve({data, textStatus, jqXHR})
			})
			.fail((jqXHR, textStatus, error) => {
				reject({jqXHR, textStatus, error})
			})
	})
}

exports.request = request

exports.get = function(url, config = {}) {
	return request(url, {
		...config,
		method: 'GET',
	})
}

exports.post = function(url, data, config = {}) {
	return request(url, {
		...config,
		data,
		method: 'POST',
	})
}
