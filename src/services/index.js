const {prepare: prepareView} = require('./view')

exports.prepare = async function () {
	await prepareView()
}
