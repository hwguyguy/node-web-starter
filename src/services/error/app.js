exports.AppError = class AppError extends Error {
	constructor(message, status, body) {
		super(message)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError)
		}

		this.status = status
		this.body = body
	}
}
