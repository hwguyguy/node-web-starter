const {parse} = require('qs')

exports.parseQuery = function (url) {
	if (url.search) {
		return parse(url.search.substr(1))
	}
	return {}
}
