const {translate, withLocale} = require('../../locales')
const {url} = require('../helpers/url')

exports.addLocaleToView = function (context) {
	if (context.view && context.params && context.params.locale) {
		if (!context.data) {
			context.data = {}
		}
		context.data.locale = context.params.locale
		context.t = withLocale(context.params.locale, translate)
		context.url = withLocale(context.params.locale, url)
	}
}
