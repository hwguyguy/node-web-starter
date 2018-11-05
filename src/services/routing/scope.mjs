export class Scope {
	constructor(router, options = {}) {
		this.router = router
		this.prefix = options.prefix || ''
		this.middlewares = options.middlewares || []
	}

	scope(prefix, fn) {
		if (typeof fn === 'function') {
			const scope = new Scope(this.router, {
				prefix: this.prefix + prefix,
				middlewares: this.middlewares,
			})
			fn(scope)
		}
	}

	use(...middlewares) {
		this.middlewares = this.middlewares.concat(...middlewares)
	}

	on(method, path, handler) {
		this.router.on(method, this.prefix + path, this.middlewares.concat(handler))
	}

	get(path, handler) {
		this.on('GET', path, handler)
	}

	post(path, handler) {
		this.on('POST', path, handler)
	}

	put(path, handler) {
		this.on('PUT', path, handler)
	}

	delete(path, handler) {
		this.on('DELETE', path, handler)
	}
}
