const Promise = require('bluebird')
const {pool} = require('./mysql')
const {camelize} = require('./parameter')
const {MysqlError, DbReadOneError, DbWriteError} = require('../../error/db')

function getQuery(sql, params, connection) {
	if (typeof params === 'undefined') {
		params = []
	}

	if (!Array.isArray(params)) {
		params = [params]
	}

	if (!connection) {
		connection = pool
	}

	return new Promise((resolve, reject) => {
		const query = connection.query(sql, params, (error, results, fields) => {
			if (error) {
				reject(new MysqlError(error, query))
				return
			}

			resolve([results, fields])
		})
	})
}

exports.raw = getQuery

exports.read = async function read(...args) {
	const [results] = await getQuery(...args)
	return results.map(camelize)
}

exports.readOne = async function readOne(...args) {
	const [results] = await getQuery(...args)
	if (!results.length) {
		throw new DbReadOneError('Record not found')
	}
	return camelize(results[0])
}

exports.write = async function write(...args) {
	const [result] = await getQuery(...args)
	if (!result.affectedRows) {
		throw new DbWriteError('Nothing affected')
	}
	return result
}
