import {root} from '@/helpers/path'
import {FileResponse} from '@/core/routing/response'

export function serve(request) {
	const filePath = root(request.url.pathname.substr(1))
	return new FileResponse(filePath)
}
