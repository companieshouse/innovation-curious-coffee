import express from 'express';
import {get} from './faq';

const router = express.Router();

router.get('/', get);

export = router;