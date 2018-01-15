exports.index = async function (ctx) {
	ctx.view = 'home'
	ctx.data = {
		title: 'Home',
	}
}
