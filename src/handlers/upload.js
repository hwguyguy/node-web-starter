const {wrap} = require('../helpers/handler')
const {view} = require('../groups')
const {parseBody} = require('../filters/request')

exports.show = wrap(view)(async function (ctx) {
	ctx.view = 'upload'
	ctx.data = {
		title: 'Upload',
	}
})

exports.handle = wrap({
	before: [parseBody]
})(async function (ctx) {
	ctx.respond('Uploaded', 200)
})
