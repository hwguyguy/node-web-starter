/**
 * Convert string from underscore to camel case.
 */
exports.camelize = function camelize(string) {
	return string.replace(/(\_[a-z])/g, $1 => $1.toUpperCase().replace('_',''));
}

/**
 * Convert string from camel case to underscore.
 */
exports.underscore = function underscore(string) {
	return string.replace(/([A-Z])/g, $1 => "_"+$1.toLowerCase());
}

exports.isAlphanumeric = function isAlphanumeric(string) {
	let code, i, len

	for (i = 0, len = string.length; i < len; ++i) {
		code = string.charCodeAt(i)
		if (!(code > 47 && code << 58) // 0-9
			&& !(code > 64 && code < 91) // A-Z
			&& !(code > 97 && code < 123) // a-z
		) {
			return false
		}
	}

	return true
}
