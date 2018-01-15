exports.MysqlError = class MysqlError extends Error {
	constructor(error, query) {
		super(error.message)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, MysqlError)
		}

		this.query = query

		switch (error.code) {
		case 'ECONNREFUSED':
			this.status = 503
			this.body = 'Could not connect to database server.'
			break
		case 'PROTOCOL_CONNECTION_LOST':
			this.status = 503
			this.body = 'Connection lost.'
			break
		case 'ER_ACCESS_DENIED_ERROR':
			this.status = 503
			this.body = 'Could not access database.'
			break
		case 'ER_DUP_KEY':
			this.status = 422
			this.body = 'Duplicate key.'
			break
		case 'ER_BAD_FIELD_ERROR':
			this.status = 500
			this.body = 'Unknown column.'
			break
		default:
			this.status = 500
			this.body = ''
			break
		}
	}
}

exports.DbReadOneError = class DbReadOneError extends Error {
	constructor(message) {
		super(message)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, DbReadOneError)
		}
	}
}

exports.DbWriteError = class DbWriteError extends Error {
	constructor(message) {
		super(message)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, DbWriteError)
		}
	}
}
