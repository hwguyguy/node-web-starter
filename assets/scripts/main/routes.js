const {byId, byTag, create: h, replace} = require('../common/dom')
//const {get, post} = require('./api')

exports['home'] = async function () {
	console.log('Print home from router.')
	//let html = await get('products')
	//console.log(html)
	replace(
		byId('list'),
		h('ul', {id: 'list', class: 'list'}, [
			h('li', null, 'One'),
			h('li', null, 'Two'),
		])
	)
}

exports['products--list'] = function () {
	let links = byTag('a')
	console.log(links)
}
