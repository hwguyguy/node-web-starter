const path = require('path')

const ROOT_PATH = path.resolve(__dirname, '..', '..')

/**
 * Get path relative to project root.
 */
exports.root = function root(...args) {
	args.unshift(ROOT_PATH);
	return path.join.apply(path, args)
}
