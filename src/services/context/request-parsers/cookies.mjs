import cookie from 'cookie'

export function parseCookies(request) {
	let requestCookies = request.headers.cookie

	if (requestCookies === undefined) {
		return {}
	}

	if (Array.isArray(requestCookies)) {
		requestCookies = requestCookies[0]
	}

	return cookie.parse(requestCookies)
}
