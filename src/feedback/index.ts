import express from 'express';
import FeedbackService from './FeedbackService';
import FeedbackRepository from '../repository/FeedbackRepository';
import validation from './validation';

const router = express.Router();

const feedbackService = new FeedbackService(new FeedbackRepository());

router.get('/', feedbackService.get);
router.post('/', validation, feedbackService.post);

export = router;