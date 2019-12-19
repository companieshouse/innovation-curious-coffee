const router = require('express').Router();

const index = require('./core/index/index');
const oops = require('./src/error');

const admin = require('./src/admin');
const cleanup = require('./src/admin/cleanup');

router.use('/', index);
router.use('/oops', oops);

router.use('/admin', admin);
router.use('/admin/cleanup', cleanup);

module.exports = router;

