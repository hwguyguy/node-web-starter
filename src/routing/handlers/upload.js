import {Response} from '@/core/routing/response'
import {ViewResponse} from '@/routing/response'

export function show() {
	return new ViewResponse('Pages/Upload', {
		title: 'Upload'
	})
}

export async function handle(request) {
	const body = await request.getBody()
	console.log(body)
	return new Response('Uploaded')
}
