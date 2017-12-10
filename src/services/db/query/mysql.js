const mysql = require('mysql')
const Promise = require('bluebird')
const yaml = require('yamljs')
const {root} = require('../../../helpers/path')
const {env} = require('../../../helpers/env')

Promise.promisifyAll(mysql)
Promise.promisifyAll(require('mysql/lib/Connection').prototype)
Promise.promisifyAll(require('mysql/lib/Pool').prototype)

const ENV = env()
const configs = yaml.load(root('config/database.yml'))
const config = configs[ENV]

let poolConfig = {
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

exports.pool = mysql.createPool(poolConfig)
