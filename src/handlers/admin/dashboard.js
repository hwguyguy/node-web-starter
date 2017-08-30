const {view} = require('../../helpers/response')

exports.index = async function(ctx) {
	return view('admin/dashboard')
}
