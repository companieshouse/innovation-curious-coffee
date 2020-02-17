"use strict";

const router = require('express').Router();

const deregister = require('./registration/deregister');
const faq = require('./faq');
const feedback = require('./feedback');
const homepage = require('./homepage');
const oops = require('./error');
const register = require('./registration/register');
const verify = require('./verify');

const admin = require('./admin');

const match = require('./admin/match');
const cleanup = require('./admin/match/cleanup');
const edit = require('./admin/match/edit');
const email = require('./admin/match/email');
const matched = require('./admin/match/matched');

const participants = require('./admin/participants');
const removeParticipant = require('./admin/participants/remove');

const dateParticipantsRegistered = require('./stats/dateParticipantsRegistered');
const participantsByDepartment = require('./stats/participantsByDepartment');

router.use('/', homepage);

router.use('/deregister', deregister);
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