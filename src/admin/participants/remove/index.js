const router = require('express').Router();
const {get, post} = require('./remove');
const middleware = require('../../../../core/middleware/middleware');

router.get('/', middleware, get);
router.post('/', middleware, post);

module.exports = router;