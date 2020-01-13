const router = require('express').Router();
const {get, post, getData} = require('./edit');
const middleware = require('../../../../core/middleware/middleware');

router.get('/:id', middleware, get);
router.post('/:id', middleware, post);
router.get('/data/:email', middleware, getData)

module.exports = router;