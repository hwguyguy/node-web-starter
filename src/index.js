const Koa = require('koa')
const {prepareServices} = require('./services')
const {bindMiddlewares} = require('./middlewares')
const {env} = require('./helpers/env')

async function main() {
	const app = new Koa
	const port = env('NODE_PORT')

	await prepareServices()
	bindMiddlewares(app)

	app.listen(port, '0.0.0.0', () => {
		console.log('Application listening on port ' + port)
	})
}

main()
