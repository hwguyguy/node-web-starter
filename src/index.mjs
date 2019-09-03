import micro from 'micro'
import {Handler} from './core/http'
import {Router} from './core/routing'
import errorMiddleware from './core/http/middlewares/error'
import logMiddleware from './core/http/middlewares/log'
import routerMiddleware from './core/http/middlewares/router'
import {prepare as prepareServices} from './services'
import {prepare as prepareRoutes} from './routes'
import {env} from './helpers/env'

async function main() {
	try {
		await prepareServices()

		const router = new Router
		prepareRoutes(router)

		const handler = new Handler({
			middlewares: [
				errorMiddleware,
				logMiddleware,
				routerMiddleware(router),
			],
		})

		const server = micro(handler.run.bind(handler))
		const port = env('NODE_PORT')

		server.listen(port, '0.0.0.0', () => {
			console.log('Application listening on port ' + port)
		})
	} catch (e) {
		console.error(e)
	}
}

main()
