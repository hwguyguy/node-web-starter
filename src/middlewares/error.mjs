export async function handleError(context, next) {
	try {
		await next()
	} catch (e) {
		context.respond('Internal Server Error', 500)
	}
}
