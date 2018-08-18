import urlLib from 'url'
import micro from 'micro'
import Engine from 'find-my-way'
import {Scope} from './scope'
import {Context} from '../context'

export class Router {
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

	async run(request, response) {
		const parsedUrl = urlLib.parse(request.url)
		const found = this.engine.find(request.method, parsedUrl.pathname)
		if (found) {
			try {
				await found.handler(new Context(
					request,
					response,
					parsedUrl,
					found.params,
				))()
			} catch (e) {
				const statusCode = e.statusCode || 500
				const messageBody = e.messageBody || 'Internal Server Error'
				micro.send(response, statusCode, messageBody)
				console.error(e)
			}
		} else {
			micro.send(response, 404, 'Route Not Found')
		}
	}
}

function compose(handlers) {
	if (!Array.isArray(handlers)) {
		return handlers
	}

	return function (context) {
		let index = -1

		function getNext() {
			const i = ++index
			if (!handlers[i]) {
				return function () {}
			}

			return async function () {
				await handlers[i](context, getNext())
			}
		}

		return getNext()
	}
}
