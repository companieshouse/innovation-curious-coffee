import express from 'express';
import {get, getData} from './participantsByDepartment';

const router = express.Router();

router.get('/', get);
router.get('/data', getData);

export = router;