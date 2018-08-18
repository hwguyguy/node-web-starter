const {TemplateEngine} = require('./template-engine')
const {root} = require('../../helpers/path')
const {env} = require('../../helpers/env')

const ENV = env()

const templateEngine = new TemplateEngine(root(), 'views', {
	compileDebug: ENV === 'development',
	rmWhitespace: true,
})

exports.prepare = async function prepare() {
	await templateEngine.compile()
}

exports.render = templateEngine.render.bind(templateEngine)
