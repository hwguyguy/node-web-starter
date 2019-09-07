export const ENV_NAME_NODE_ENV = 'NODE_ENV'
export const ENV_NAME_NODE_PORT = 'NODE_PORT'
export const ENV_NAME_ROOT_PATH = 'ROOT_PATH' // Path of project root

const envVars = {
	[ENV_NAME_NODE_ENV]: process.env.NODE_ENV || 'development',
	[ENV_NAME_NODE_PORT]: process.env.NODE_PORT || 3000,
}

export function env(name = ENV_NAME_NODE_ENV) {
	if (!envVars[name] && process.env[name]) {
		envVars[name] = process.env[name]
	}

	return envVars[name]
}

export function setEnv(name, value) {
	envVars[name] = value
}
