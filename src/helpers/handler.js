exports.wrap = function (options) {
	const befores = options.before
	const afters = options.after

	return function (handler) {
		if (!befores && !afters) {
			return handler
		}

		return async function (context) {
			if (Array.isArray(befores)) {
				for (let i = 0, len = befores.length; i < len; ++i) {
					await befores[i](context)
					if (context.sent) {
						return
					}
				}
			}
			await handler(context)
			if (!context.sent && Array.isArray(afters)) {
				for (let i = 0, len = afters.length; i < len; ++i) {
					await afters[i](context)
					if (context.sent) {
						return
					}
				}
			}
		}
	}
}
