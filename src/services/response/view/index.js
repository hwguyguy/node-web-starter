const {render, precompileTemplates} = require('./renderer')

exports.createAction = function createAction(file, data, status = 200) {
	return {
		type: 'view',
		file,
		data,
		status,
	}
}

exports.handleAction = function handleAction(action, ctx) {
	ctx.body = render(action.file, ctx, action.data)
	ctx.status = action.status
}

exports.prepare = async function() {
	await precompileTemplates()
}
