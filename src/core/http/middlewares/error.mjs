import micro from 'micro'

export default async function error(request, response, next) {
	try {
		await next()
	} catch (e) {
		micro.send(response, 500, 'Internal Server Error')
		console.error(e)
	}
}
