const {request, get, post} = require('../common/ajax')

const URL_PREFIX = 'http://localhost:3000'

function getFullUrl(path) {
	if (path.charAt(0) !== '/') {
		path = '/' + path
	}

	return URL_PREFIX + path
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
