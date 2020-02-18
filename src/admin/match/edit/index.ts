import express from 'express';
import {get, post, getData} from './edit';

const router = express.Router();

router.get('/:id', get);
router.post('/:id', post);
router.get('/data/:email', getData)

export = router;