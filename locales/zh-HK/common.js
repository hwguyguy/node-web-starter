module.exports = {
	required: field => '請填寫' + field + '。',

	minLength: (field, length) => '請填寫' + length + '個字的' + field + '。',
}
