import path from 'path'
import {
	env,
	ENV_NAME_ROOT_PATH,
	ENV_NAME_RUNTIME_DIR,
} from '@/helpers/env'

/**
 * Get path relative to project root.
 *
 * @param {...string} args
 * @return {string}
 */
export function root(...args) {
	return path.join(env(ENV_NAME_ROOT_PATH), ...args)
}

/**
 * Get path relative to runtime directory.
 *
 * @param {...string} args
 * @return {string}
 */
export function runtime(...args) {
	return root(env(ENV_NAME_RUNTIME_DIR), ...args)
}
