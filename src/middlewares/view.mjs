export async function renderView(context, next) {
	await next()

	if (context.view) {
		if (!context.data) {
			context.data = {}
		}
		context.respondView(
			context.view,
			Object.assign(context.data, {
				_entry: context.view,
			}),
			context.status
		)
	}
}
