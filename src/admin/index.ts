import express from 'express';
import {get, post} from './admin';

const router = express.Router();

router.get('/', get);
router.post('/', post);

export = router;