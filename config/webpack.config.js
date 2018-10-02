const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ENV = process.env.NODE_ENV || 'development'
const ROOT_PATH = path.resolve(__dirname, '..')

function root(...args) {
	args.unshift(ROOT_PATH)
	return path.join.apply(path, args)
}

module.exports = {
	mode: ENV,

	entry: {
		main: [
			root('assets/scripts/main/index.js'),
			root('assets/styles/main/index.styl'),
		],
		admin: [
			root('assets/scripts/admin/index.js'),
			root('assets/styles/admin/index.styl'),
		],
	},

	output: {
		path: root('dist'),
		filename: '[name].js',
		sourceMapFilename: '[file].map',
	},

	resolve: {
		extensions: ['.js']
	},

	//externals: {
	//    'jquery': 'jQuery',
	//    'ckeditor': 'CKEDITOR',
	//},

	optimization: {
		minimizer: [
			new UglifyJsPlugin(),
		]
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),

		...(ENV === 'development' ? [
			new webpack.LoaderOptionsPlugin({
				debug: true
			}),

			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
				//exclude: ['main.css', 'admin.css'],
			}),
		]: []),

		new webpack.DefinePlugin({
			'process.env': {
				ENV: JSON.stringify(ENV),
				NODE_ENV: JSON.stringify(ENV),
			}
		}),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: [
						['@babel/preset-env', {
							targets: Object.assign(
								{
									browsers: ['last 2 versions'],
								},
								(ENV === 'production' && {
									uglify: true,
								})
							),
						}],
					],
					plugins: [
						require('@babel/proposal-class-properties'),
						require('@babel/proposal-object-rest-spread'),
					],
				},
			},

			{
				test: /\.styl/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							minimize: ENV === 'production',
						},
					},
					{
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
					},
					{
						loader: 'stylus-loader',
						options: {
							sourceMap: true,
						}
					}
				]
			},
		]
	},
}
