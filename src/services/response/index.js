const json = require('./json')
const view = require('./view')
const error = require('./error')

exports.actions = {
	json: json.createAction,
	view: view.createAction,
	error: error.createAction,
}

exports.handleAction = async function handleAction(action, ctx) {
	if (typeof action === 'undefined' || action === null) {
		return
	}

	if (typeof action === 'string') {
		ctx.body = action
		return
	}

	switch (action.type) {
	case 'json':
		json.handleAction(action, ctx)
		break

	case 'view':
		view.handleAction(action, ctx)
		break

	case 'error':
		await handleError(action, ctx)
		break

	default:
		break
	}
}

exports.handleError = async function handleError(action, ctx) {
	if (typeof action === 'undefined' || action === null) {
		return
	}

	let finalAction = await error.handleAction(action, ctx)

	if (finalAction) {
		if (finalAction.type === 'error') {
			throw new Error('Action type "error" is not allowed in error action.')
		}
		await handleAction(finalAction, ctx)
	}
}

exports.prepare = async function() {
	await view.prepare()
}