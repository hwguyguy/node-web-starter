const {parse: parseUrl} = require('url')
const {send} = require('micro')
const Router = require('find-my-way')
const {Context} = require('./context')
const handlers = require('./handlers')

const router = new Router

function redirect(redirectUrl) {
	return function ({response}) {
		response.writeHead(302, {
			'Location': redirectUrl
		})
		response.end()
	}
}

exports.prepare = function () {
	router.get('/favicon.ico', handlers.file.serve)
	router.get('/public/*', handlers.file.serve)
	router.get('/dist/*', handlers.file.serve)
	router.get('/', handlers.home.index)
	router.get('/products', handlers.products.index)
	router.get('/products/:id', handlers.products.show)
	router.get('/products/:id/:slug', handlers.products.show)
	router.get('/upload', handlers.upload.show)
	router.post('/upload', handlers.upload.handle)
	router.get('/admin', redirect('/admin/dashboard'))
	router.get('/admin/dashboard', handlers.admin.dashboard.index)
}

exports.run = async function (request, response) {
	const parsedUrl = parseUrl(request.url)
	console.log('<-- ' + request.method + ' ' + parsedUrl.pathname)
	const start = Date.now()
	const found = router.find(request.method, parsedUrl.pathname)
	if (found) {
		try {
			await found.handler(new Context(
				request,
				response,
				parsedUrl,
				found.params,
			))
			const requestTime = Date.now() - start
			const requestTimeString = requestTime < 10000 ? requestTime + 'ms' : Math.round(requestTime / 1000) + 's'
			console.log('--> ' + request.method + ' ' + parsedUrl.pathname + ' ' + response.statusCode + ' ' + requestTimeString)
		} catch (e) {
			const statusCode = e.statusCode || 500
			const messageBody = e.messageBody || 'Internal Server Error'
			send(response, statusCode, messageBody)
			console.log('--> ' + request.method + ' ' + parsedUrl.pathname + ' ' + statusCode)
			console.error(e)
		}
	} else {
		send(response, 404, 'Route Not Found')
		console.log('--> ' + request.method + ' ' + parsedUrl.pathname + ' 404')
	}
}
