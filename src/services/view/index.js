const {render, precompileTemplates} = require('./renderer')

exports.render = render

exports.prepare = async function () {
	await precompileTemplates()
}
