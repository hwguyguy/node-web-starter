const {pool} = require('./mysql')
const {read, readOne, write} = require('./io')
const {select, where, orderBy, page} = require('./syntax')
const {underscore} = require('./parameter')

function selectOne(table, handleJoinOptions) {
	return async function (selectArg, whereArg, options = {}) {
		let sql = ''
		let params = []

		;[sql, params] = select(selectArg, sql, params)
		sql += ' FROM `' + table + '`'

		if (typeof handleJoinOptions === 'function') {
			let [_sql, _params] = await handleJoinOptions(options)
			sql += ' ' + _sql
			params.push(..._params)
		}

		;[sql, params] = where(whereArg, sql, params)

		sql += ' LIMIT 1'

		if (options.sqlOnly) {
			return [sql, params]
		}

		return readOne(sql, params)
	}
}

function selectList(table, handleJoinOptions) {
	return async function (selectArg, whereArg, orderByArg, pageArg, pageSizeArg, options = {}) {
		let params = []
		let sql = ''

		;[sql, params] = select(selectArg, sql, params)
		sql += ' FROM `' + table + '`'

		if (typeof handleJoinOptions === 'function') {
			let [_sql, _params] = await handleJoinOptions(options)
			sql += ' ' + _sql
			params.push(..._params)
		}

		;[sql, params] = where(whereArg, sql, params)
		;[sql, params] = orderBy(orderByArg, sql, params)
		;[sql, params] = page(pageArg, pageSizeArg, sql, params)

		if (options.sqlOnly) {
			return [sql, params]
		}

		let records

		if (options.withTotal) {
			let connection = await pool.getConnectionAsync()
			let count

			try {
				records = await read(sql, params, connection)
				count = await readOne('SELECT FOUND_ROWS() `total`', [], connection)
			} catch (e) {
				throw e
			} finally {
				connection.release()
			}

			records.total = count.total
		} else {
			records = await read(sql, params)
		}

		return records
	}
}

function insertOne(table, processData) {
	return async function (data) {
		data = await processData(data)

		let sql = 'INSERT INTO `' + table + '` SET ?'
		let params = [underscore(data)]

		let result = await write(sql, params)

		data.id = result.insertId

		return data
	}
}

function update(table, processData, getDefaultWhereArg) {
	return async function (originalData, whereArg) {
		let processedData = await processData(originalData)

		if (typeof whereArg === 'undefined'
			&& typeof getDefaultWhereArg === 'function'
		) {
			whereArg = getDefaultWhereArg(processedData, originalData)
		}

		let sql = 'UPDATE `' + table + '` SET ?'
		let params = [underscore(processedData)]

		;[sql, params] = where(whereArg, sql, params)

		await write(sql, params)

		return processedData
	}
}

function updateOne(table, processData) {
	return update(table, processData, (processed, original) => {
		return [
			'`id` = ?',
			[original.id]
		]
	})
}

function deleteFrom(table) {
	return function (whereArg, options = {}) {
		let sql = 'DELETE FROM `' + table + '`'
		let params = []

		;[sql, params] = where(whereArg, sql, params)

		if (options.sqlOnly) {
			return [sql, params]
		}

		return write(sql, params)
	}
}

module.exports = {
	selectOne,
	select: selectList,
	insertOne,
	update,
	updateOne,
	deleteFrom,
}
