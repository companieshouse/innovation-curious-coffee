import express from 'express';
import FeedbackService from './FeedbackService';
import validation from './validation';

const router = express.Router();

const feedbackService = new FeedbackService();

router.get('/', feedbackService.get);
router.post('/', validation, feedbackService.post);

export = router;