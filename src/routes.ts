import express from 'express';

import deregister from './registration/deregister';
import faq from './faq';
import feedback from './feedback';
import homepage from './homepage';
import oops from './error';
import register from './registration/register';
import verify from './verify';
import admin from './admin';
import match from './admin/match';
import cleanup from './admin/match/cleanup';
import edit from './admin/match/edit';
import email from './admin/match/email';
import matched from './admin/match/matched';
import participants from './admin/participants';
import removeParticipant from './admin/participants/remove';
import dateParticipantsRegistered from './stats/dateParticipantsRegistered';
import participantsByDepartment from './stats/participantsByDepartment';

const router = express.Router();

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

export = router;