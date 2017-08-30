const {camelize: camelizeString, underscore: underscoreString} = require('../../helpers/string')

/**
 * Convert object keys to camel case.
 */
exports.camelize = function camelize(data) {
	let convertedData = {}
	for (let prop in data) {
		convertedData[camelizeString(prop)] = data[prop]
	}
	return convertedData
}

/**
 * Convert object keys to underscore.
 */
exports.underscore = function underscore(data) {
	let convertedData = {}
	for (let prop in data) {
		convertedData[underscoreString(prop)] = data[prop]
	}
	return convertedData
}

exports.permit = function permit(data, requiredProps = [], optionalProps = [], extraData) {
	let convertedData = {}

	requiredProps.forEach(prop => {
		if (typeof prop === 'string') {
			convertedData[prop] = data[prop]
		} else if (typeof Array.isArray(prop)
			&& typeof prop[0] === 'string'
			&& typeof prop[1] === 'function'
		) {
			convertedData[prop[0]] = prop[1](data[prop[0]], extraData)
		}
	})

	optionalProps.forEach(prop => {
		if (typeof prop === 'string'
			&& prop in data
		) {
			convertedData[prop] = data[prop]
		} else if (typeof Array.isArray(prop)
			&& typeof prop[0] === 'string'
			&& prop[0] in data
			&& typeof prop[1] === 'function'
		) {
			convertedData[prop[0]] = prop[1](data[prop[0]], extraData)
		}
	})

	return convertedData
}
