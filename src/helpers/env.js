const defaultEnv = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	NODE_PORT: process.env.NODE_PORT || 3000,
}

exports.env = function env(name = 'NODE_ENV') {
	return defaultEnv[name] || process.env[name]
}
