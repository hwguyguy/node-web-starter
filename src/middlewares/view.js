const {render} = require('../services/view')

exports.renderView = function () {
	return async function (ctx, next) {
		await next()
		if (ctx.body !== null && ctx.view) {
			ctx.body = render(ctx.view, ctx, ctx.data)
		}
	}
}

exports.layout = function (layoutPath) {
	return async function (ctx, next) {
		await next()
		if (ctx.view) {
			if (!ctx.data) {
				ctx.data = {}
			}
			if (!ctx.data._layout) {
				ctx.data._layout = layoutPath
			}
		}
	}
}
