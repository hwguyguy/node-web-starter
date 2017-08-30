const {prepare: prepareResponseService} = require('./response')

exports.prepareServices = async function() {
	await prepareResponseService()
}
