const translations = {
	en: require('./en'),
	'en-US': require('./en'),
	zh: require('./zh-HK'),
	'zh-HK': require('./zh-HK'),
	'zh-TW': require('./zh-HK'),
	'zh-CN': require('./zh-CN'),
}

const defaultLocale = 'en'

exports.getAvailableLocales = function getAvailableLocales() {
	return Object.keys(translations)
}

exports.isLocaleAvailable = function isLocaleAvailable(locale) {
	return !!translations[locale]
}

exports.translate = function translate(locale, keys) {
	let translation = translations[locale]

	if (!translation) {
		translation = translations[defaultLocale]
	}

	if (typeof keys === 'string') {
		keys = keys.split('.')
	}

	for (let i = 0, len = keys.length; i < len; ++i) { // Don't use for...of syntax here as client side will require this file
		let key = keys[i]
		translation = translation[key]
		if (typeof translation === 'undefined') {
			break
		}
	}

	return translation
}

exports.withLocale = function withLocale(locale, fn) {
	return function (...args) {
		return fn(locale, ...args)
	}
}
