exports.url = function url(pathname, locale) {
	if (pathname.charAt(0) !== '/') {
		pathname = '/' + pathname
	}
	if (locale) {
		locale = '/' + locale
	}
	return locale + pathname
}
