const {wrap} = require('../helpers/handler')
const {view} = require('../filter-groups')

const products = [
	{id: 1, title: 'iPad 4 Mini', price: 500.01, inventory: 2},
	{id: 2, title: 'H&M T-Shirt White', price: 10.99, inventory: 10},
	{id: 3, title: 'Charli XCX - Sucker CD', price: 19.99, inventory: 5}
]

products.forEach(p => {
	p.slug = p.title.replace(/ /g, '-')
})

exports.index = wrap(view)(async function (ctx) {
	ctx.view = 'products/list'
	ctx.data = {
		title: 'All Products',
		products,
	}
})

exports.show = wrap(view)(async function (ctx) {
	const product = products.find(p => p.id === parseInt(ctx.params.id, 10))

	ctx.view = 'products/show'
	ctx.data = {
		title: product.title + ' - Products',
		product,
	}
})
