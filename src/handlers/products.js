import {ViewResponse} from '@/routing/response'

const products = [
	{id: 1, title: 'iPad 4 Mini', price: 500.01, inventory: 2},
	{id: 2, title: 'H&M T-Shirt White', price: 10.99, inventory: 10},
	{id: 3, title: 'Charli XCX - Sucker CD', price: 19.99, inventory: 5}
]

products.forEach(p => {
	p.slug = p.title.replace(/ /g, '-')
})

export function index() {
	return new ViewResponse('Pages/Products/List', {
		title: 'All Products',
		products,
	})
}

export function show(request) {
	const product = products.find(p => p.id === parseInt(request.params.id, 10))
	return new ViewResponse('Pages/Products/Show', {
		title: product.title + ' - Products',
		product,
	})
}
