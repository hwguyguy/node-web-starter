import mysql from 'mysql'
import yaml from 'yamljs'
import {root} from '../../helpers/path'
import {env} from '../../helpers/env'

const ENV = env()
const configs = yaml.load(root('config/database.yml'))
const config = configs[ENV]

const poolConfig = {
	connectionLimit: config.pool || 10,
	user: config.username,
	password: config.password,
	database: config.database,

	// debug: true,
	timezone: 'Z',
	supportBigNumbers: true,
	multipleStatements: true,
}

if (config.host) {
	poolConfig.host = config.host
}

if (config.port) {
	poolConfig.port = config.port
}

if (config.socket) {
	poolConfig.socketPath = config.socket
}

export const pool = mysql.createPool(poolConfig)

export function getConnection() {
	return new Promise(function (resolve, reject) {
		pool.getConnection(function (error, connection) {
			if (error) {
				reject(error)
				return
			}
			resolve(connection)
		})
	})
}

/**
 * @param {string|Object} options - SQL string or query options
 * @param {Array} [params]
 * @param {Connection} [connection]
 */
export function query(options, params, connection) {
	if (typeof options === 'string') {
		options = {
			sql: options
		}
	}

	if (Array.isArray(params)) {
		options.values = params
	}

	if (!connection) {
		connection = pool
	}

	return new Promise(function (resolve, reject) {
		const query = connection.query(options, function (error, results) {
			if (error) {
				reject(new MysqlError(error, query))
				return
			}
			resolve(results)
		})
	})
}

export class MysqlError extends Error {
	constructor(error, query) {
		super(error.message)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, MysqlError)
		}

		this.query = query

		switch (error.code) {
		case 'ECONNREFUSED':
			this.status = 503
			this.body = 'Could not connect to database server.'
			break
		case 'PROTOCOL_CONNECTION_LOST':
			this.status = 503
			this.body = 'Connection lost.'
			break
		case 'ER_ACCESS_DENIED_ERROR':
			this.status = 503
			this.body = 'Could not access database.'
			break
		case 'ER_DUP_KEY':
			this.status = 422
			this.body = 'Duplicate key.'
			break
		case 'ER_BAD_FIELD_ERROR':
			this.status = 500
			this.body = 'Unknown column.'
			break
		default:
			this.status = 500
			this.body = ''
			break
		}
	}
}
