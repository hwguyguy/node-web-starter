import urlLib from 'url'
import Engine from 'find-my-way'
import Scope from './scope'
import Request from './request'

export default class Router {
	constructor() {
		this.engine = new Engine
	}

	build(fn) {
		const scope = new Scope(this)
		fn(scope)
	}

	on(method, path, handler) {
		this.engine.on(method, path, compose(handler))
	}

	match(request) {
		const parsedUrl = urlLib.parse(request.url)
		const found = this.engine.find(request.method, parsedUrl.pathname)

		if (found) {
			return found.handler(new Request(
				request,
				parsedUrl,
				found.params,
			))
		}

		return null
	}
}

function compose(handlers) {
	if (!Array.isArray(handlers)) {
		return handlers
	}

	return function (request, state = {}) {
		let index = -1

		function getNext() {
			const i = ++index
			if (!handlers[i]) {
				return function () {}
			}

			return function () {
				return handlers[i](request, getNext(), state)
			}
		}

		return getNext()
	}
}
