exports.byId = document.getElementById.bind(document)

exports.byClass = document.getElementsByClassName.bind(document)

exports.byTag = document.getElementsByTagName.bind(document)

exports.create = function create(tag, attributes, children) {
	const el = document.createElement(tag)
	if (attributes) {
		for (const name in attributes) {
			el.setAttribute(name, attributes[name])
		}
	}
	if (typeof children === 'string') {
		el.textContent = children
	} else if (Array.isArray(children)) {
		for (let i = 0, len = children.length; i < len; ++i) {
			el.appendChild(children[i])
		}
	}
	return el
}

exports.replace = function replace(oldNode, newNode) {
	oldNode.parentNode.replaceChild(newNode, oldNode)
}
