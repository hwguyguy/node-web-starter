const {send} = require('micro')
const {parseCookies} = require('./request-parsers/cookies')
const {parseQuery} = require('./request-parsers/query')
const {parseBody} = require('./request-parsers/body')
const {render} = require('../services/view')

exports.Context = class Context {
	constructor(request, response, url, params) {
		this.request = request
		this.response = response
		this.url = url
		this.params = params
		this.sent = false
	}

	getCookies() {
		if (!this.cookies) {
			this.cookies = parseCookies(this.request)
		}
		return this.cookies
	}

	getQuery() {
		if (!this.query) {
			this.query = parseQuery(this.url)
		}
		return this.query
	}

	async getBody() {
		if (!this.body) {
			this.body = await parseBody(this.request)
		}
		return this.body
	}

	respond(data, status = 200) {
		if (this.sent) {
			return
		}
		send(this.response, status, data)
		this.sent = true
	}

	respondView(template, data, status) {
		const html = render(template, data)
		this.response.setHeader('Content-Type', 'text/html')
		this.respond(html, status)
	}
}
