const path = require('path')

const ROOT_PATH = path.resolve(__dirname, '..', '..')

/**
 * Get path relative to project root.
 */
exports.root = function root(...args) {
	return path.join(ROOT_PATH, ...args)
}
