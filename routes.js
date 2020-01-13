const router = require('express').Router();

const faq = require('./src/faq');
const feedback = require('./src/feedback');
const homepage = require('./src/homepage');
const oops = require('./src/error');
const register = require('./src/registration/register');
const verify = require('./src/verify');

const admin = require('./src/admin');

const match = require('./src/admin/match');
const cleanup = require('./src/admin/match/cleanup');
const edit = require('./src/admin/match/edit');
const email = require('./src/admin/match/email');
const matched = require('./src/admin/match/matched');

const participants = require('./src/admin/participants');
const removeParticipant = require('./src/admin/participants/remove');

const dateParticipantsRegistered = require('./src/stats/dateParticipantsRegistered');
const participantsByDepartment = require('./src/stats/participantsByDepartment');

router.use('/', homepage);

router.use('/faq', faq);
router.use('/feedback', feedback);
router.use('/oops', oops);
router.use('/register', register);
router.use('/verify', verify);

router.use('/admin', admin);

router.use('/admin/matches/match', match);
router.use('/admin/matches/all', matched);
router.use('/admin/matches/cleanup', cleanup);
router.use('/admin/matches/edit', edit);
router.use('/admin/matches/email', email);

router.use('/admin/participants/all', participants);
router.use('/admin/participants/remove', removeParticipant);

router.use('/stats/dateParticipantsRegistered', dateParticipantsRegistered);
router.use('/stats/participantsByDepartment', participantsByDepartment);

module.exports = router;