import micro from 'micro'
import {parseCookies} from './request-parsers/cookies'
import {parseQuery} from './request-parsers/query'
import {parseBody} from './request-parsers/body'
import {render} from '../view'

export class Context {
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
		micro.send(this.response, status, data)
		this.sent = true
	}

	respondView(template, data, status) {
		const html = render(template, data)
		this.response.setHeader('Content-Type', 'text/html')
		this.respond(html, status)
	}
}
