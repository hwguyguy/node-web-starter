import micro from 'micro'
import {Handler} from '@/core/http'
import {Router} from '@/core/routing'
import errorMiddleware from '@/core/http/middlewares/error'
import logMiddleware from '@/core/http/middlewares/log'
import routerMiddleware from '@/core/http/middlewares/router'
import {prepare as prepareServices} from '@/services'
import {routes} from '@/routes'
import {
	env,
	setEnv,
	ENV_NAME_NODE_PORT,
	ENV_NAME_ROOT_PATH,
	ENV_NAME_RUNTIME_DIR,
} from '@/helpers/env'

export async function main(options) {
	try {
		checkOptions(options)
		setupOptions(options)

		await prepareServices()

		const router = new Router
		router.build(routes)

		const handler = new Handler({
			middlewares: [
				errorMiddleware,
				logMiddleware,
				routerMiddleware(router),
			],
		})

		const server = micro(handler.run.bind(handler))
		const port = env(ENV_NAME_NODE_PORT)

		server.listen(port, '0.0.0.0', () => {
			console.log('Application listening on port ' + port)
		})
	} catch (e) {
		console.error(e)
	}
}

function checkOptions(options) {
	if (!options) {
		throw new Error('Options should not be empty.')
	}
}

function setupOptions(options) {
	if (!options.root) {
		throw new Error('Root path is not defined.')
	}

	if (!options.runtimeDirectory) {
		throw new Error('Runtime directory is not defined.')
	}

	setEnv(ENV_NAME_ROOT_PATH, options.root)
	setEnv(ENV_NAME_RUNTIME_DIR, options.runtimeDirectory)
}
