const Promise = require('bluebird')
const {pool} = require('./mysql')
const {camelize} = require('./parameter')
const {actions: {error: createError}} = require('../../response')
const errorTypes = require('../../response/error/error-types')

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
		let query = connection.query(sql, params, (error, results, fields) => {
			if (error) {
				reject(createError(errorTypes.DB_MYSQL, {
					error,
					query,
				}))
				return
			}

			resolve(results)
		})
	})
}

exports.raw = getQuery

exports.read = async function read(...args) {
	let results = await getQuery(...args)
	return results.map(camelize)
}

exports.readOne = async function readOne(...args) {
	let results = await getQuery(...args)
	if (!results.length) {
		throw createError(errorTypes.DB_READ_ONE, {
			message: 'Record not found',
		})
	}
	return camelize(results[0])
}

exports.write = async function write(...args) {
	let result = await getQuery(...args)
	if (!result.affectedRows) {
		throw createError(errorTypes.DB_WRITE, {
			message: 'Nothing affected',
		})
	}
	return result
}
