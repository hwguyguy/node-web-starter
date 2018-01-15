const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'
const ROOT_PATH = path.resolve(__dirname, '..')

function root(...args) {
	args.unshift(ROOT_PATH)
	return path.join.apply(path, args)
}

const mainCss = new ExtractTextPlugin('main.css')
const adminCss = new ExtractTextPlugin('admin.css')

module.exports = {
	entry: {
		main: [
			root('assets/js/main/index.js'),
			root('assets/stylus/main/index.styl'),
		],
		admin: [
			root('assets/js/admin/index.js'),
			root('assets/stylus/admin/index.styl'),
		],
	},

	output: {
		path: root('public'),
		filename: '[name].js',
		sourceMapFilename: '[file].map',
		chunkFilename: '[id].chunk.js',
	},

	resolve: {
		extensions: ['.js']
	},

	//externals: {
	//    'jquery': 'jQuery',
	//    'ckeditor': 'CKEDITOR',
	//},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: [
						['env', {
							targets: Object.assign({
								browsers: ['last 2 versions'],
							}, (ENV === 'production' && {
								uglify: true,
							})),
						}],
					],
					plugins: [
						'transform-class-properties',
						'transform-object-rest-spread',
					],
				},
			},

			{
				include: root('assets/stylus/main/index.styl'),
				use: mainCss.extract({
					fallback: 'style-loader',
					use: [{
						loader: 'css-loader',
						options: {
							minimize: ENV === 'production',
						}
					}, {
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: () => [
								require('autoprefixer')({
									browsers: ['> 1%', 'not ie <= 8'],
									remove: false,
								}),
							]
						}
					}, {
						loader: 'stylus-loader',
						options: {
							sourceMap: true,
						}
					}],
				})
			},

			{
				include: root('assets/stylus/admin/index.styl'),
				use: adminCss.extract({
					fallback: 'style-loader',
					use: [{
						loader: 'css-loader',
						options: {
							minimize: ENV === 'production',
						}
					}, {
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: () => [
								require('autoprefixer')({
									browsers: ['> 1%', 'not ie <= 8'],
									remove: false,
								}),
							]
						}
					}, {
						loader: 'stylus-loader',
						options: {
							sourceMap: true,
						}
					}],
				})
			},
		]
	},

	plugins: [
		...(ENV === 'development' ? [
			new webpack.LoaderOptionsPlugin({
				debug: true
			}),

			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
				//exclude: ['main.css', 'admin.css'],
			}),
		]: []),

		mainCss,
		adminCss,

		...(ENV === 'production' ? [
			new webpack.DefinePlugin({
				'process.env': {
					'ENV': JSON.stringify(ENV),
					'NODE_ENV': JSON.stringify(ENV),
				}
			}),

			new webpack.optimize.UglifyJsPlugin({
				compress: true,
				mangle: true,
				beautify: false,
				comments: false,
			}),
		]: []),

	]
}
