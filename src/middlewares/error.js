const {AppError} = require('../services/error/app')
const {MysqlError, DbReadOneError, DbWriteError} = require('../services/error/db')

exports.handleError = function () {
	return async function (ctx, next) {
		try {
			await next()
		} catch (e) {
			if (e instanceof AppError) {
				ctx.body = e.body || e.message
				ctx.status = e.status || 500
			} else if (e instanceof DbReadOneError) {
				ctx.body = e.message
				ctx.status = 404
			} else if (e instanceof DbWriteError) {
				ctx.body = e.message
				ctx.status = 422
			} else if (e instanceof MysqlError) {
				ctx.body = e.body
				ctx.status = e.status
				console.error(e)
			} else {
				ctx.status = 500
				console.error(e)
			}
		}
	}
}
