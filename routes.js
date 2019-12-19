const router = require('express').Router();

const index = require('./core/index/index');
const admin = require('./core/admin');

router.use('/', index);
router.use('/admin', admin);

module.exports = router;

