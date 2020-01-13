const router = require('express').Router();

const faq = require('./src/faq');
const feedback = require('./src/feedback');
const homepage = require('./src/homepage');
const oops = require('./src/error');

const admin = require('./src/admin');
const cleanup = require('./src/admin/cleanup');
const participants = require('./src/admin/participants');
const removeParticipant = require('./src/admin/participants/remove');

router.use('/', homepage);

router.use('/faq', faq);
router.use('/feedback', feedback);
router.use('/oops', oops);

router.use('/admin', admin);
router.use('/admin/cleanup', cleanup);
router.use('/admin/participants/all', participants);
router.use('/admin/participants/remove', removeParticipant);

module.exports = router;

