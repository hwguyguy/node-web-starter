const {prepare: prepareView} = require('./view')

exports.prepareServices = async function () {
	await prepareView()
}
