const logger = require('koa-logger')
const serve = require('koa-static')
const mount = require('koa-mount')
const router = require('./router')
const {root} = require('../helpers/path')
const {env} = require('../helpers/env')

const ENV = env()

exports.bindMiddlewares = function bindMiddlewares(app) {
	app.use(logger())
	if (ENV !== 'production') {
		app.use(mount('/public', serve(root('public'))))
	}
	app.use(...router())
}
