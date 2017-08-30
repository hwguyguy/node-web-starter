const {handleAction, handleError} = require('../services/response')

exports.handle = async function handle(ctx, next) {
	try {
		let action = await next()
		await handleAction(action, ctx)
	} catch (e) {
		try {
			await handleError(e, ctx)
		} catch (e) {
			ctx.status = 500
			console.error(e)
		}
	}
}

exports.layout = function(layoutPath) {
	return async function(ctx, next) {
		let action = await next()
		if (typeof action !== 'undefined'
			&& action !== null
			&& action.type === 'view'
		) {
			if (!action.data) {
				action.data = {}
			}

			if (typeof action.data._layout === 'undefined') {
				action.data._layout = layoutPath
			}
		}
		return action
	}
}
