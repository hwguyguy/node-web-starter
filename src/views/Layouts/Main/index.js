import React from 'react'
import Header from './Header'

export default function Main(props) {
	return (
		<html>
			<meta charset="UTF-8"/>
			<link rel="stylesheet" href="/dist/main.css?v=1"/>
			<title>{props.title || 'Web Starter'}</title>
			<body className={props._entry.replace(/\//g, '-')}>
				<Header {...props}/>
				{props.children}
				<script src="/dist/main.js?v=1"></script>
			</body>
		</html>
	)
}
