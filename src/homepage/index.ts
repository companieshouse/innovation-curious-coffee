import express from 'express';
import HomepageService from './HomepageService';

const router = express.Router();

const homepageService = new HomepageService();

router.get('/', homepageService.get);

export = router;
