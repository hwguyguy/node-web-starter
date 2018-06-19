const {wrap} = require('../helpers/handler')
const {view} = require('../groups')

exports.show = wrap(view)(async function (ctx) {
	ctx.view = 'upload'
	ctx.data = {
		title: 'Upload',
	}
})

exports.handle = async function (ctx) {
	const body = await ctx.getBody()
	console.log(body)
	ctx.respond('Uploaded', 200)
}
