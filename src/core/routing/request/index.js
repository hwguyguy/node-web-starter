import {parseCookies} from './request-parsers/cookies'
import {parseQuery} from './request-parsers/query'
import {parseBody} from './request-parsers/body'

export default class Request {
	constructor(request, url, params) {
		this.request = request
		this.url = url
		this.params = params
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
}
