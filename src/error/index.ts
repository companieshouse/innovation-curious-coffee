import express from 'express';
import ErrorService from './ErrorService';

const router = express.Router();

const errorService = new ErrorService();

router.get('/', errorService.get);

export = router;