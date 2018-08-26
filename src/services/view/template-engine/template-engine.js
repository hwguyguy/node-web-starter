const {extname, normalize, dirname} = require('path')
const {readFileSync} = require('fs')
const readdir = require('recursive-readdir')
const {createTemplate} = require('./compiler')

class TemplateEngine {
	/**
	 * @param {string} importsHome Directory of the "~" in import path.
	 * @param {string} templatesDirName Directory name of the templates relative to imports home.
	 * @param {Object} [ejsOptions] EJS options.
	 */
	constructor(importsHome, templatesDirName, ejsOptions) {
		this.imports = {}
		this.importsHome = importsHome
		this.templatesDirName = templatesDirName
		this.ejsOptions = ejsOptions
	}

	/**
	 * Compile templates in templates directory.
	 */
	async compile() {
		const templatesDir = normalize(
			this.importsHome + '/' + this.templatesDirName
		)
		const filePaths = await readdir(templatesDir)
		for (const filePath of filePaths) {
			const content = readFileSync(filePath, 'utf8')
			const template = createTemplate(content, this.ejsOptions)
			this.addTemplate(filePath, template)
		}
	}

	/**
	 * Render a template.
	 * @param {string} templatePath Template path relative to templates directory.
	 * @param {Object} [props={}] Template variables.
	 * @return {string} Result string.
	 */
	render(templatePath, props = {}) {
		const importPath = this.importsHome
			+ '/' + this.templatesDirName
			+ '/' + templatePath

		if (typeof this.imports[importPath] !== 'function') {
			throw new Error('Template "' + importPath + '" not found')
		}

		return this.imports[importPath](props)
	}

	/**
	 * Add template to imports.
	 * @private
	 * @param {string} filePath Absolute path of the template file.
	 * @param {Function} template Template function.
	 */
	addTemplate(filePath, template) {
		const ext = extname(filePath)
		if (ext !== '.ejs') {
			throw new Error(filePath + ' template format is not supported')
		}

		const importPath = filePath.slice(0, -ext.length)

		// Pre-require modules.
		if (template.meta && template.meta.imports) {
			const metaImports = template.meta.imports
			const templatePrefix = this.importsHome + '/' + this.templatesDirName + '/'

			for (const name in metaImports) {
				const _importPath = this.resolveImportPath(metaImports[name], importPath)

				if (!this.imports[_importPath] && !_importPath.startsWith(templatePrefix)) {
					try {
						this.imports[_importPath] = require(_importPath)
					} catch (e) {
						if (e.code === 'MODULE_NOT_FOUND') {
							throw new Error('Module "' + _importPath + '" not found in ' + importPath)
						}

						throw e
					}
				}
			}
		}

		if (template.meta && template.meta.extend) {
			this.imports[importPath] = props => {
				const extendedPath = this.resolveImportPath(template.meta.extend.name, importPath)

				if (!this.imports[extendedPath]) {
					throw new Error('Extended template "' + extendedPath + '" not found in ' + importPath)
				}

				if (template.imports === undefined) {
					if (template.meta && template.meta.imports) {
						template.imports = this.getRuntimeImports(template.meta.imports, importPath)
					} else {
						template.imports = null
					}
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

				return this.imports[extendedPath](extendedProps)
			}
		} else {
			this.imports[importPath] = props => {
				if (template.imports === undefined) {
					if (template.meta && template.meta.imports) {
						template.imports = this.getRuntimeImports(template.meta.imports, importPath)
					} else {
						template.imports = null
					}
				}

				return template({
					...props,
					imports: template.imports,
				})
			}
		}
	}

	/**
	 * @private
	 */
	getRuntimeImports(metaImports, relativeToPath) {
		const runtimeImports = {}
		for (const name in metaImports) {
			const path = this.resolveImportPath(metaImports[name], relativeToPath)
			runtimeImports[name] = this.imports[path]
		}
		return runtimeImports
	}

	/**
	 * @private
	 */
	resolveImportPath(importPath, relativeToPath) {
		switch (importPath.charAt(0)) {
		case '~':
			importPath = normalize(this.importsHome + importPath.substr(1))
			break
		case '.':
			importPath = normalize(dirname(relativeToPath) + '/' + importPath)
			break
		}
		return importPath
	}

}

exports.TemplateEngine = TemplateEngine
