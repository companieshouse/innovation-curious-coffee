const router = require('express').Router();
const {get, post} = require('./deregister');

router.get('/', get);
router.post('/', post);

module.exports = router;