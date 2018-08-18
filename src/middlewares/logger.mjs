export async function log({request, response, url}, next) {
	console.log('<-- ' + request.method + ' ' + url.pathname)
	const start = Date.now()
	await next()
	const requestTime = Date.now() - start
	const requestTimeString = requestTime < 10000 ? requestTime + 'ms' : Math.round(requestTime / 1000) + 's'
	console.log('--> ' + request.method + ' ' + url.pathname + ' ' + response.statusCode + ' ' + requestTimeString)
}
