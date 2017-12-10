const errorTypes = require('./error-types')

exports.createAction = function(...args) {
	let errorType = errorTypes.APP
	let detail = {}

	if (args.length === 1) {
		detail = args[0]
	} else if (args.length === 2) {
		errorType = args[0]
		detail = args[1]
	}

	return {
		type: 'error',
		errorType,
		detail,
	}
}

exports.handleAction = function(action, ctx) {
	let body = ''
	let status = 500

	switch (action.errorType) {
	case errorTypes.APP:
		body = {
			message: action.detail.message
		}
		status = action.detail.status || 400
		break

	case errorTypes.DB_READ_ONE:
		body = {
			message: action.detail.message
		}
		status = 404
		break

	case errorTypes.DB_WRITE:
		body = {
			message: action.detail.message
		}
		status = 422
		break

	case errorTypes.DB_MYSQL:
		switch (action.detail.error.code) {
		case 'ECONNREFUSED':
			body = {
				message: 'Could not connect to database server.'
			}
			status = 503
			break

		case 'PROTOCOL_CONNECTION_LOST':
			body = {
				message: 'Connection lost'
			}
			status = 503
			break

		case 'ER_ACCESS_DENIED_ERROR':
			body = {
				message: 'Could not access database.'
			}
			status = 503
			break

		case 'ER_BAD_DB_ERROR':
			body = {
				message: 'Unknown database.'
			}
			status = 503
			break

		case 'ER_DUP_KEY':
			body = {
				message: 'Duplicate key.'
			}
			status = 422
			break

		case 'ER_BAD_FIELD_ERROR':
			body = {
				message: 'Unknown column.',
			}
			status = 500
			break

		default:
			status = 500
			break
		}

		console.error(action)

		break

	default:
		status = 500
		console.error(action)
		break
	}

	ctx.body = body
	ctx.status = status
}
