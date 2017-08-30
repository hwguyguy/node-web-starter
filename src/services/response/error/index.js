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
	switch (action.errorType) {
	case errorTypes.APP:
		ctx.body = {
			message: action.detail.message
		}
		ctx.status = action.detail.status || 400
		break

	case errorTypes.DB_READ_ONE:
		ctx.body = {
			message: action.detail.message
		}
		ctx.status = 404
		break

	case errorTypes.DB_WRITE:
		ctx.body = {
			message: action.detail.message
		}
		ctx.status = 422
		break

	case errorTypes.DB_MYSQL:
		switch (action.detail.error.code) {
		case 'ECONNREFUSED':
			ctx.body = {
				message: 'Could not connect to database server.'
			}
			ctx.status = 503
			break

		case 'PROTOCOL_CONNECTION_LOST':
			ctx.body = {
				message: 'Connection lost'
			}
			ctx.status = 503
			break

		case 'ER_ACCESS_DENIED_ERROR':
			ctx.body = {
				message: 'Could not access database.'
			}
			ctx.status = 503
			break

		case 'ER_BAD_DB_ERROR':
			ctx.body = {
				message: 'Unknown database.'
			}
			ctx.status = 503
			break

		case 'ER_DUP_KEY':
			ctx.body = {
				message: 'Duplicate key.'
			}
			ctx.status = 422
			break

		case 'ER_BAD_FIELD_ERROR':
			ctx.body = {
				message: 'Unknown column.',
			}
			ctx.status = 500
			break

		default:
			ctx.status = 500
			break
		}

		console.error(action)

		break

	default:
		ctx.status = 500
		console.error(action)
		break
	}
}
