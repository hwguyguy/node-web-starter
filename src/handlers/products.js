const {view} = require('../helpers/response')

let products = [
	{id: 1, title: 'iPad 4 Mini', price: 500.01, inventory: 2},
	{id: 2, title: 'H&M T-Shirt White', price: 10.99, inventory: 10},
	{id: 3, title: 'Charli XCX - Sucker CD', price: 19.99, inventory: 5}
]

products.forEach(p => {
	p.slug = p.title.replace(/ /g, '-')
})

exports.index = async function(ctx) {
	return view('products/list', {
		title: 'All Products',
		products,
	})
}

exports.show = async function(ctx) {
	let product = products.find(p => p.id === parseInt(ctx.params.id, 10))

	return view('products/show', {
		title: product.title + ' - Products',
		product,
	})
}
