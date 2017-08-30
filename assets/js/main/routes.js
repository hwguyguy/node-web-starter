const {get, post} = require('./api')

module.exports = {
	'home': async () => {
		console.log('Print home from router.')
		//let html = await get('products')
		//console.log(html)
	},

	'products-list': () => {
		let links = $('a')
		console.log(links)
	},
}
