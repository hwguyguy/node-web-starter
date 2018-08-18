const pathLib = require('path')
const fs = require('mz/fs')
const readdir = require('recursive-readdir')
const {createTemplate} = require('./compiler')

function resolveImportPath(importPath, relativeToPath) {
	if (importPath.charAt(0) === '.') {
		importPath = pathLib.normalize(pathLib.dirname(relativeToPath) + '/' + importPath)
	}
	return importPath
}

exports.TemplateEngine = class TemplateEngine {
	constructor(importsRoot, templatesDirName, ejsOptions) {
		this.imports = {}
		this.importsRoot = importsRoot
		this.templatesDirName = templatesDirName
		this.ejsOptions = ejsOptions
	}

	async compile() {
		const templatesDir = pathLib.normalize(this.importsRoot + '/' + this.templatesDirName)
		const filePaths = await readdir(templatesDir)
		for (const filePath of filePaths) {
			const content = await fs.readFile(filePath, 'utf8')
			const template = createTemplate(content, this.ejsOptions)
			this.addTemplate(filePath, template)
		}
	}

	render(importPath, props = {}) {
		importPath = this.templatesDirName + '/' + importPath

		if (typeof this.imports[importPath] !== 'function') {
			throw new Error('Template ' + importPath + ' not found')
		}

		return this.imports[importPath](props)
	}

	addTemplate(filePath, template) {
		const ext = pathLib.extname(filePath)
		if (ext !== '.ejs') {
			throw new Error(filePath + ' template format is not supported')
		}

		const importPath = filePath.replace(this.importsRoot + '/', '').slice(0, -ext.length)

		if (template.meta && template.meta.imports) {
			const imports = template.meta.imports
			const templatePrefix = this.templatesDirName + '/'
			for (const name in imports) {
				const _importPath = resolveImportPath(imports[name], importPath)
				if (!this.imports[_importPath]
					&& _importPath.substr(0, templatePrefix.length) !== templatePrefix
				) {
					this.imports[_importPath] = require(this.importsRoot + '/' + _importPath)
				}
			}
		}

		if (template.meta && template.meta.extend) {
			this.imports[importPath] = props => {
				const extendedPath = resolveImportPath(template.meta.extend.name, importPath)

				if (!this.imports[extendedPath]) {
					throw new Error('Extended template "' + extendedPath + '" from "' + importPath + '" not found')
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

	getRuntimeImports(metaImports, relativeToPath) {
		const runtimeImports = {}
		for (const name in metaImports) {
			const path = resolveImportPath(metaImports[name], relativeToPath)
			runtimeImports[name] = this.imports[path]
		}
		return runtimeImports
	}
}
