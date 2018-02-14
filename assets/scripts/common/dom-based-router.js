exports.run = function(routes) {
	document.body.className.split(/\s+/).forEach(className => {
		if (typeof routes[className] === 'function') {
			routes[className]()
		}
	})
}
