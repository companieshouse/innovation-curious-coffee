const router = require('express').Router();
const {get, post} = require('./feedback');

router.get('/', get);
router.post('/', post);

module.exports = router;