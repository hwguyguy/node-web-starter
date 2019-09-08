import handlers from '@/routing/handlers'
import {extractFromPath as extractLocaleFromPath} from '@/routing/middlewares/locale'

export function routes(s) {
	s.get('/favicon.ico', handlers.file.serve)
	s.get('/public/*', handlers.file.serve)
	s.get('/dist/*', handlers.file.serve)

	s.use(extractLocaleFromPath)

	s.get('/', handlers.home.index)
	s.get('/home', redirect('/'))
	s.get('/:locale', handlers.home.index)
	s.scope('/products', s => {
		s.get('', handlers.products.index)
		s.get('/:id', handlers.products.show)
		s.get('/:id/:slug', handlers.products.show)
	})
	s.get('/upload', handlers.upload.show)
	s.post('/upload', handlers.upload.handle)
}

function redirect(redirectUrl, status = 302) {
	return function ({response}) {
		response.writeHead(status, {
			'Location': redirectUrl
		})
		response.end()
	}
}
