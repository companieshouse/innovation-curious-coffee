const router = require('express').Router();
const {get} = require('./matched');
const middleware = require('../../../../core/middleware/middleware');

router.get('/', middleware, get);

module.exports = router;