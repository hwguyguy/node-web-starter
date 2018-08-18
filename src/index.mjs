import micro from 'micro'
import {prepare as prepareServices} from './services'
import {Router} from './services/routing'
import {prepare as prepareRoutes} from './routes'
import {env} from './helpers/env'

async function main() {
	try {
		await prepareServices()

		const router = new Router

		prepareRoutes(router)

		const server = micro(router.run.bind(router))
		const port = env('NODE_PORT')

		server.listen(port, '0.0.0.0', () => {
			console.log('Application listening on port ' + port)
		})
	} catch (e) {
		console.error(e)
	}
}

main()
