const Router = require('koa-router')
const {handleError} = require('./error')
const {renderView} = require('./view')
const handlers = require('../handlers')

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
		ctx.view = template
		ctx.data = data
	}
}

function redirect(url) {
	return async function(ctx) {
		ctx.redirect(url)
	}
}

exports.buildRoutes = function () {
	return draw(router => {
		router.use(handleError())
		router.use(renderView())

		router.get('/', handlers.home.index)
		router.get('/products', handlers.products.index)
		router.get('/products/:id', handlers.products.show)
		router.get('/products/:id/:slug', handlers.products.show)

		router.use('/admin', ...draw(router => {
			router.get('/', redirect('/admin/dashboard'))
			router.get('/dashboard', handlers.admin.dashboard.index)
		}))
	})
}
