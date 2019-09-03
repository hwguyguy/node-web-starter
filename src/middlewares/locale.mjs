import localesModule from '../../locales'
import {ViewResponse} from '../core/routing/response'

export async function extractFromPath(request, next) {
	const response = await next()

	if (response instanceof ViewResponse) {
		const locale = request.params.locale
		response.data.locale = locale
		response.data.translate = localesModule.withLocale(locale, localesModule.translate)
	}

	return response
}
