const {render, precompileTemplates} = require('./renderer')

exports.createAction = function createAction(file, data) {
	return {
		type: 'view',
		file,
		data,
	}
}

exports.handleAction = function handleAction(action, ctx) {
	ctx.body = render(action.file, {
		_ctx: ctx,
		...action.data,
	})
}

exports.prepare = async function() {
	await precompileTemplates()
}
