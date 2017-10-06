module.exports = {
	required: field => '请填写' + field + '。',

	minLength: (field, length) => '请填写' + length + '个字的' + field + '。',
}
