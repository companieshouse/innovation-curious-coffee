import express from 'express';
import {get} from './homepage';

const router = express.Router();

router.get('/', get);

export = router;