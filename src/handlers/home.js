import {ViewResponse} from '@/routing/response'

export function index() {
	return new ViewResponse('Pages/Home', {
		title: 'Home',
	})
}
