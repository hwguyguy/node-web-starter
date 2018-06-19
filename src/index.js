const micro = require('micro')
const {prepare: prepareServices} = require('./services')
const {prepare: prepareRouter, run: runRouter} = require('./router')
const {env} = require('./helpers/env')

async function main() {
	const port = env('NODE_PORT')

	await prepareServices()
	prepareRouter()

	const server = micro(runRouter)

	server.listen(port, '0.0.0.0', () => {
		console.log('Application listening on port ' + port)
	})
}

main()
