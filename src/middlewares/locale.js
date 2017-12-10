const {getAvailableLocales, isLocaleAvailable} = require('../../locales')

function getLocaleFromPath(path, prefix) {
	let localeInPath = path.replace(prefix, '').split('/')[1]

	if (isLocaleAvailable(localeInPath)) {
		return localeInPath
	}

	return null
}

module.exports = function({
	fromPath = false,
	prefix = '',
	fromHeader = true,
} = {}) {
	return async function (ctx, next) {
		let locale = null

		if (!locale && fromPath) {
			locale = getLocaleFromPath(ctx.request.path, prefix)
		}

		if (!locale && fromHeader) {
			locale = ctx.request.acceptsLanguages(getAvailableLocales())
		}

		ctx.locale = locale

		return await next()
	}
}
