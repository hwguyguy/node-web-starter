const {root} = require('../../helpers/path')

exports.VIEWS_DIR = 'views' // Relative to project root
exports.viewsRoot = root.bind(null, exports.VIEWS_DIR)
