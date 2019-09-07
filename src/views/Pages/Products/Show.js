import React from 'react'
import Main from '@/views/Layouts/Main'

export default function Upload(props) {
	return (
		<Main {...props}>
			<h1>{props.product.title}</h1>
			<div>
				<div>Price: ${props.product.price}</div>
				<div>Inventory: {props.product.inventory}</div>
			</div>
		</Main>
	)
}
