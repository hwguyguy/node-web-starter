exports.createAction = function(data) {
	return {
		type: 'json',
		data,
	}
}

exports.handleAction = function(action, ctx) {
	ctx.body = action.data
}
