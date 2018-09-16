import handlers from './handlers'
import {log} from './middlewares/logger'
import {handleError} from './middlewares/error'
import {extractFromPath as extractLocaleFromPath} from './middlewares/locale'
import {renderView} from './middlewares/view'

export function prepare(router) {
	router.build(s => {
		s.use(log, handleError)

		s.get('/favicon.ico', handlers.file.serve)
		s.get('/public/*', handlers.file.serve)
		s.get('/dist/*', handlers.file.serve)

		s.use(renderView, extractLocaleFromPath)

		s.get('/', handlers.home.index)
		s.get('/:locale', handlers.home.index)
		s.scope('/products', s => {
			s.get('', handlers.products.index)
			s.get('/:id', handlers.products.show)
			s.get('/:id/:slug', handlers.products.show)
		})
		s.get('/upload', handlers.upload.show)
		s.post('/upload', handlers.upload.handle)
		s.get('/admin', redirect('/admin/dashboard'))
		s.get('/admin/dashboard', handlers.admin.dashboard.index)
	})
}

function redirect(redirectUrl, status = 302) {
	return function ({response}) {
		response.writeHead(status, {
			'Location': redirectUrl
		})
		response.end()
	}
}
