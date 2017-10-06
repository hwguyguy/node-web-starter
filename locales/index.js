const translations = {
	en: require('./en'),
	'en-US': require('./en'),
	zh: require('./zh-HK'),
	'zh-HK': require('./zh-HK'),
	'zh-TW': require('./zh-HK'),
	'zh-CN': require('./zh-CN'),
}

const defaultLocale = 'en'

function getAvailableLocales() {
	return Object.keys(translations)
}

function isLocaleAvailable(locale) {
	return !!translations[locale]
}

function translate(keys, locale) {
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

function withLocale(locale, translate) {
	return function (keys) {
		return translate(keys, locale)
	}
}

module.exports = {
	getAvailableLocales,
	isLocaleAvailable,
	translate,
	withLocale,
}
