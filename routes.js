const router = require('express').Router();

const index = require('./core/index/index');

const admin = require('./core/admin');
const cleanup = require('./core/cleanup');

router.use('/', index);

router.use('/admin', admin);
router.use('/admin/cleanup', cleanup);

module.exports = router;

