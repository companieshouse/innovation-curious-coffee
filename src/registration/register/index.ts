import express from 'express';
import {get, post} from './register';
import customValidations from './validation';

const router = express.Router();

router.get('/', get);
router.post('/', customValidations, post);

export = router;