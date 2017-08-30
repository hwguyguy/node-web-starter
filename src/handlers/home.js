const {view} = require('../helpers/response')
const db = require('../services/db')

exports.index = async function(ctx) {
	return view('home', {
		title: 'Home',
	})
}
