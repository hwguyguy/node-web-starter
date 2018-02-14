const {wrap} = require('../helpers/handler')
const {view} = require('../groups')

exports.index = wrap(view)(async function (ctx) {
	ctx.view = 'home'
	ctx.data = {
		title: 'Home',
	}
})
