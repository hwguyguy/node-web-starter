import ReactDomServer from 'react-dom/server'
import {Response} from '@/core/routing/response'
import {root} from '@/helpers/path'

const doctype = '<!DOCTYPE html>'

export default class ViewResponse extends Response {
	constructor(template, data = {}, status = 200) {
		super(null, status)
		this.template = template
		this.data = data
	}

	send(httpResponse) {
		this.data._entry = this.template

		this.body = render(this.template, this.data)

		httpResponse.setHeader('Content-Type', 'text/html')

		super.send(httpResponse)
	}
}

function render(template, data) {
	const component = require(root('build/views', template)).default
	const element = component(data)
	return doctype + ReactDomServer.renderToStaticMarkup(element)
}
