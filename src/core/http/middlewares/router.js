import micro from 'micro'

export default function (router) {
	return async function (request, response, next) {
		const handler = router.match(request)

		if (handler) {
			const routingResponse = await handler()

			if (routingResponse) {
				routingResponse.send(response)
			} else {
				await next()
			}
		} else {
			micro.send(response, 404, 'Route Not Found')
		}
	}
}
