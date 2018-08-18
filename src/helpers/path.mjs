import path from 'path'
import __dirname from './dirname'

const ROOT_PATH = path.resolve(__dirname, '..', '..')

/**
 * Get path relative to project root.
 */
export function root(...args) {
	return path.join(ROOT_PATH, ...args)
}
