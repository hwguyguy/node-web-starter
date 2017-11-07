function select(arg, sql = '', params = []) {
	if (typeof arg === 'string') {
		sql += ' SELECT ' + arg
	} else if (Array.isArray(arg)) {
		let [_sql, _params] = arg
		sql += ' SELECT ' + _sql
		params.push(..._params)
	} else {
		sql += ' SELECT *'
	}

	return [sql, params]
}

function where(arg, sql = '', params = []) {
	if (typeof arg === 'string') {
		sql += ' WHERE ' + arg
	} else if (Array.isArray(arg)) {
		let [_sql, _params] = arg
		sql += ' WHERE ' + _sql
		params.push(..._params)
	}

	return [sql, params]
}

function orderBy(arg, sql = '', params = []) {
	if (typeof arg === 'string') {
		sql += ' ORDER BY ' + arg
	}

	return [sql, params]
}

function pageToLimitArgs(page, pageSize) {
	page = parseInt(page, 10) || 1
	pageSize = parseInt(pageSize, 10) || 10
	if (page < 1) {
		page = 1
	}
	if (pageSize < 1) {
		pageSize = 1
	}
	let skip = (page - 1) * pageSize
	return [skip, pageSize]
}

function page(pageArg, pageSizeArg, sql = '', params = []) {
	if (pageArg !== null) {
		sql += ' LIMIT ?,?'
		if (Array.isArray(pageSizeArg)) {
			pageSizeArg = Math.min(parseInt(pageSizeArg[0], 10), pageSizeArg[1])
		} else {
			pageSizeArg = Math.min(parseInt(pageSizeArg, 10), 100)
		}
		params = [...params, ...pageToLimitArgs(pageArg, pageSizeArg)]
	}

	return [sql, params]
}

module.exports = {
	select,
	where,
	orderBy,
	page,
}
