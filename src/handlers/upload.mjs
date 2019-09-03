import {Response, ViewResponse} from '../core/routing/response'

export function show() {
	return new ViewResponse('upload', {
		title: 'Upload'
	})
}

export async function handle(request) {
	const body = await request.getBody()
	console.log(body)
	return new Response('Uploaded')
}
