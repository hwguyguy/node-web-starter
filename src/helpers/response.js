const {
	actions: {
		json,
		view,
		error,
	}
} = require('../services/response')
const errorTypes = require('../services/response/error/error-types')

module.exports = {
	json,
	view,
	error,
	errorTypes,
}
