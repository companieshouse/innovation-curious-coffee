import express from 'express';
import {get, post} from './match';

const router = express.Router();

router.get('/', get);
router.post('/', post);

export = router;