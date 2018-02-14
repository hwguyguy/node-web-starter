const {request, get, post} = require('../common/ajax')

const urlPrefix = 'http://localhost:3000'

const urlPattern = /^(http|https):\/\//

function getFullUrl(path) {
	if (urlPattern.test(path)) {
		return path
	}

	if (path.charAt(0) !== '/') {
		path = '/' + path
	}

	return urlPrefix + path
}

exports.request = function(url, ...args) {
	return request(getFullUrl(url), ...args)
}

exports.get = function(url, ...args) {
	return get(getFullUrl(url), ...args)
}

exports.post = function(url, ...args) {
	return post(getFullUrl(url), ...args)
}
