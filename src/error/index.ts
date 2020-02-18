import express from 'express';
import {get} from './error';

const router = express.Router();

router.get('/', get);

export = router;