const path = require('path')
const {VIEWS_DIR} = require('./config')
const {root} = require('../../helpers/path')

const PROJ_ROOT = root()
const IMPORTS = {}

function resolveImportPath(importPath, relativeToPath) {
	if (importPath.charAt(0) === '.') {
		importPath = path.normalize(path.dirname(relativeToPath) + '/' + importPath)
	}
	return importPath
}

function getRuntimeImports(metaImports, relativeToPath) {
	const runtimeImports = {}
	for (const name in metaImports) {
		const path = resolveImportPath(metaImports[name], relativeToPath)
		runtimeImports[name] = IMPORTS[path]
	}
	return runtimeImports
}

exports.addTemplate = function addTemplate(filePath, template) {
	if (filePath.substr(-4) !== '.ejs') {
		throw new Error(filePath + ' template format is not supported')
	}

	const importPath = filePath.replace(PROJ_ROOT + '/', '').replace(/.ejs$/, '')

	if (template.meta && template.meta.extend) {
		IMPORTS[importPath] = function (props) {
			const extendedPath = resolveImportPath(template.meta.extend.name, importPath)

			if (!IMPORTS[extendedPath]) {
				throw new Error('Extended template "' + extendedPath + '" from "' + importPath + '" not found')
			}

			if (!template.imports && template.meta && template.meta.imports) {
				template.imports = getRuntimeImports(template.meta.imports, importPath)
			}
			const bodyHtml = template({
				...props,
				imports: template.imports,
			})
			const extendedProps = {
				...props,
				...template.meta.extend.props,
				[template.meta.extend.propName || 'body']: bodyHtml
			}

			return IMPORTS[extendedPath](extendedProps)
		}
	} else {
		IMPORTS[importPath] = function (props) {
			if (!template.imports && template.meta && template.meta.imports) {
				template.imports = getRuntimeImports(template.meta.imports, importPath)
			}
			return template({
				...props,
				imports: template.imports,
			})
		}
	}
}

exports.render = function render(importPath, props = {}) {
	importPath = VIEWS_DIR + '/' + importPath
	if (typeof IMPORTS[importPath] !== 'function') {
		throw new Error('Template ' + importPath + ' not found')
	}

	return IMPORTS[importPath](props)
}
