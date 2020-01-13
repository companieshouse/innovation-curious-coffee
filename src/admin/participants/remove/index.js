const router = require('express').Router();
const {get, post} = require('./remove');

router.get('/', get);
router.post('/', post);

module.exports = router;