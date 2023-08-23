import express from 'express';
import FaqService from './FaqService';

const router = express.Router();

const faqService = new FaqService();

router.get('/', faqService.get);

export = router;
