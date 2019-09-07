import React from 'react'
import Main from '@/views/Layouts/Main'

export default function Home(props) {
	return (
		<Main {...props}>
			<h1>Home Page</h1>
			<div>
				<a href="/products">All Products</a>
			</div>
			<ul id="list"></ul>
			<br/>
			<a href="/upload">Upload</a>
		</Main>
	)
}
