import express from 'express';
import {get} from './matched';

const router = express.Router();

router.get('/', get);

export = router;