exports.renderView = function (context) {
	if (context.view) {
		context.respondView(context.view, context.data, context.status)
	}
}
