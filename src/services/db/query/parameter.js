const {camelize: camelizeString, underscore: underscoreString} = require('../../../helpers/string')

/**
 * Convert object keys to camel case.
 */
function camelize(data) {
	let convertedData = {}
	for (let prop in data) {
		convertedData[camelizeString(prop)] = data[prop]
	}
	return convertedData
}

/**
 * Convert object keys to underscore.
 */
function underscore(data) {
	let convertedData = {}
	for (let prop in data) {
		convertedData[underscoreString(prop)] = data[prop]
	}
	return convertedData
}

/**
 * Convert input data to a suitable format for database insertion and updating.
 *
 * @param {object} data - Input data.
 * @param {string[]|Array<string|Array>} props - Column names in camel case.
 * @param {*=} extraData - Extra data.
 * @return {object}
 */
function permit(data, props, extraData) {
	let convertedData = {}

	if (Array.isArray(props)) {
		props.forEach(prop => {
			if (typeof prop === 'string'
				&& prop in data
			) {
				convertedData[prop] = data[prop]
			} else if (Array.isArray(prop)
				&& typeof prop[0] === 'string'
				&& typeof prop[1] === 'function'
			) {
				convertedData[prop[0]] = prop[1](data[prop[0]], extraData)
			}
		})
	}

	return convertedData
}

function except(permitProps, exceptProps) {
	if (Array.isArray(exceptProps)) {
		permitProps = permitProps.filter(p => {
			if (typeof p === 'string') {
				if (exceptProps.indexOf(p) !== -1) {
					return false
				}
			} else if (Array.isArray(p)) {
				if (exceptProps.indexOf(p[0]) !== -1) {
					return false
				}
			}
			return true
		})
	}
	return permitProps
}

module.exports = {
	camelize,
	underscore,
	permit,
	except,
}
