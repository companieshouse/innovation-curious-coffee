import express from 'express';
import {get, getData} from './dateParticipantsRegistered';

const router = express.Router();

router.get('/', get);
router.get('/data', getData);

export = router;