export default async function log(request, response, next) {
	console.log(`<-- ${request.method} ${request.url}`)
	const start = Date.now()
	await next()
	const requestTime = Date.now() - start
	const requestTimeString = requestTime < 10000 ? requestTime + 'ms' : Math.round(requestTime / 1000) + 's'
	console.log(`--> ${request.method} ${request.url} ${response.statusCode} ${requestTimeString}`)
}
