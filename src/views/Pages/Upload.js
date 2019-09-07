import React from 'react'
import Main from '@/views/Layouts/Main'

export default function Upload(props) {
	return (
		<Main {...props}>
			<h1>Upload</h1>
			<form action="/upload" method="post" enctype="multipart/form-data">
				<input type="file" name="file"/>
				<button>Submit</button>
			</form>
		</Main>
	)
}
