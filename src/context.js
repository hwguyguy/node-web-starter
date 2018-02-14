const {send} = require('micro')
const {render} = require('./services/view')

exports.Context = class Context {
	constructor(request, response, url, params) {
		this.request = request
		this.response = response
		this.url = url
		this.params = params
		this.sent = false
	}

	respond(data, status = 200) {
		send(this.response, status, data)
		this.sent = true
	}

	respondView(template, data, status) {
		const html = render(template, data)
		this.response.setHeader('Content-Type', 'text/html')
		this.respond(html, status)
	}
}
