const {render} = require('../services/view')

exports.renderView = function () {
	return async function (ctx, next) {
		await next()
		if (ctx.body !== null && ctx.view) {
			ctx.body = render(ctx.view, ctx, ctx.data)
		}
	}
}
