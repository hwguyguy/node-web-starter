exports.addLocaleToView = function (context) {
	if (context.view && context.params && context.params.locale) {
		if (!context.data) {
			context.data = {}
		}
		context.data.locale = context.params.locale
	}
}
