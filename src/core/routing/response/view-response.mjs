import Response from './response'
import {render} from '../../../services/view'

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
