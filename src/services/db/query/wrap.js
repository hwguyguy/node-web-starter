function wrap(fn) {
	let connection

	return (sql, params) => fn(sql, params, connection)
}
