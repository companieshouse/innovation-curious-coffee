const router = require('express').Router();

const faq = require('./src/faq');
const feedback = require('./src/feedback');
const index = require('./core/index/index');
const oops = require('./src/error');

const admin = require('./src/admin');
const cleanup = require('./src/admin/cleanup');

router.use('/', index);

router.use('/faq', faq);
router.use('/feedback', feedback);
router.use('/oops', oops);

router.use('/admin', admin);
router.use('/admin/cleanup', cleanup);

module.exports = router;

