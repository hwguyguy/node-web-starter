import path from 'path'
import {env, ENV_NAME_ROOT_PATH} from '@/helpers/env'

/**
 * Get path relative to project root.
 */
export function root(...args) {
	return path.join(env(ENV_NAME_ROOT_PATH), ...args)
}
