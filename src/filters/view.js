exports.renderView = function (context) {
	if (context.view) {
		context.respondView(
			context.view,
			Object.assign(context.data, {
				_entry: context.view,
			}),
			context.status
		)
	}
}
