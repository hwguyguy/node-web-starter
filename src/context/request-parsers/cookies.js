const {parse} = require('cookie')

exports.parseCookies = function (request) {
	let requestCookies = request.headers.cookie

	if (requestCookies === undefined) {
		return {}
	}

	if (Array.isArray(requestCookies)) {
		requestCookies = requestCookies[0]
	}

	return parse(requestCookies)
}
