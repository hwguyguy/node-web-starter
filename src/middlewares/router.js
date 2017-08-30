const Router = require('koa-router')
const {handle: handleResponse, layout} = require('./response')
const handlers = require('../handlers')
const {view} = require('../helpers/response')

function draw(callback, handlers) {
	let router = new Router
	callback(router, handlers)
	return [router.routes(), router.allowedMethods()]
}

function sendView(template, data) {
	return async function(ctx) {
		if (typeof data === 'function') {
			data = data(ctx)
		}

		return view(template, data)
	}
}

function redirect(url) {
	return async function(ctx) {
		ctx.redirect(url)
	}
}

function buildRoutes() {
	return draw(router => {
		router.use(handleResponse)

		router.use(layout('layouts/main'))

		router.get('/', handlers.home.index)
		router.get('/products', handlers.products.index)
		router.get('/products/:id', handlers.products.show)
		router.get('/products/:id/:slug', handlers.products.show)

		router.use('/admin', layout('layouts/admin'), ...draw(router => {
			router.get('/', redirect('/admin/dashboard'))
			router.get('/dashboard', handlers.admin.dashboard.index)
		}))
	})
}

module.exports = buildRoutes
