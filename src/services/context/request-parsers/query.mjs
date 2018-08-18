import qs from 'qs'

export function parseQuery(url) {
	if (url.search) {
		return qs.parse(url.search.substr(1))
	}
	return {}
}
