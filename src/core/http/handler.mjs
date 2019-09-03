export default class Handler {
	constructor(options = {}) {
		this.composed = null
		this.middlewares = []

		this.use(...options.middlewares)
	}

	use(...middlewares) {
		this.middlewares = this.middlewares.concat(...middlewares)
		this.composed = compose(this.middlewares)
	}

	run(request, response) {
		return this.composed(request, response)()
	}
}

function compose(middlewares) {
	if (!Array.isArray(middlewares)) {
		return middlewares
	}

	return function (request, response, state = {}) {
		let index = -1

		function getNext() {
			const i = ++index
			if (!middlewares[i]) {
				return function () {}
			}

			return function () {
				return middlewares[i](request, response, getNext(), state)
			}
		}

		return getNext()
	}
}
