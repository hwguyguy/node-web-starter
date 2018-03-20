const {parseBody} = require('../filters/request')
const {renderView} = require('../filters/view')
const {addLocaleToView} = require('../filters/locale')

exports.view = {
	after: [
		addLocaleToView,
		renderView,
	]
}

exports.upload = {
	before: [
		parseBody,
	]
}
