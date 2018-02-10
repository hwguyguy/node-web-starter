require('promise-polyfill')
require('regenerator-runtime/runtime')
const router = require('../common/dom-based-router')
const routes = require('./routes')

router.run(routes)
