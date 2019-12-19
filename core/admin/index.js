const router = require('express').Router();
const {get, post} = require('./admin');

router.get('/', get);
router.post('/', post);

module.exports = router;