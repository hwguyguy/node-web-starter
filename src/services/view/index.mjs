import {TemplateEngine} from './template-engine'
import {root} from '../../helpers/path'
import {env} from '../../helpers/env'

const ENV = env()

const templateEngine = new TemplateEngine(root(), 'views', {
	compileDebug: ENV === 'development',
	rmWhitespace: true,
})

export async function prepare() {
	await templateEngine.compile()
}

export const render = templateEngine.render.bind(templateEngine)
