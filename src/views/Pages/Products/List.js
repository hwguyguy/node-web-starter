import React from 'react'
import Main from '@/views/Layouts/Main'

export default function Upload(props) {
	return (
		<Main {...props}>
			<h1>All Products</h1>
			<ul>
				{props.products.map(product => (
					<li>
						<a href={`/products/${product.id}/${product.slug}`}>{product.title} - ${product.price}</a>
					</li>
				))}
			</ul>
		</Main>
	)
}
