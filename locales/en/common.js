const {ucfirst} = require('./helpers')

module.exports = {
	required: field => ucfirst(field) + ' is required.',

	minLength: (field, length) => ucfirst(field) + ' must be of minimum ' + length + ' characters.',
}
