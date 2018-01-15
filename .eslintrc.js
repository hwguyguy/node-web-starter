module.exports = {
	'env': {
		'es6': true,
		'node': true,
		'browser': true,
		'jquery': true,
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 2017,
		'ecmaFeatures': {
			'experimentalObjectRestSpread': true,
		},
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single',
			{
				avoidEscape: true
			}
		],
		'semi': [
			'error',
			'never'
		],
		'no-console': 'off',
		'no-empty': [
			'error',
			{
				allowEmptyCatch: true
			}
		],
	}
}
