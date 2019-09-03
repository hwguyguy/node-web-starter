import {ViewResponse} from '../core/routing/response'

export function index() {
	return new ViewResponse('home', {
		title: 'Home',
	})
}
