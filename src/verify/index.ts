import express from 'express';
import { get } from './verify';

const router = express.Router();

router.get('/:email', get);

export = router;
