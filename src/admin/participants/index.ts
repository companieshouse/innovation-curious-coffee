import express from 'express';
import {get} from  './participants';

const router = express.Router();

router.get('/', get);

export = router;