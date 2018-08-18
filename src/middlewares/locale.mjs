import localesModule from '../../locales'

function modifyViewData(context) {
	if (!context.data) {
		context.data = {}
	}
	context.data.locale = context.locale
	context.data.t = context.translate
}

export async function extractFromPath(context, next) {
	let locale = context.params.locale

	context.locale = locale
	context.translate = localesModule.withLocale(locale, localesModule.translate)

	await next()

	if (context.view) {
		modifyViewData(context)
	}
}
