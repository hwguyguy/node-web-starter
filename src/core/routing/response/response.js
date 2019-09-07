import micro from 'micro'

export default class Response {
	constructor(body = null, status = 200) {
		this.status = status
		this.body = body
	}

	send(httpResponse) {
		micro.send(httpResponse, this.status, this.body)
	}
}
