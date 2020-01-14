const router = require('express').Router();
const {get, post} = require('./cleanup');

router.get('/', get);
router.post('/', post);

module.exports = router;