module.exports = {
	sourceMaps: 'inline',
	presets: [
		['@babel/preset-env', {
			targets: {
				node: 'current'
			}
		}],
		'@babel/preset-react',
	],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		['module-resolver', {
			root: ['.'],
			alias: {
				'@': './build',
			},
		}],
	],
}
