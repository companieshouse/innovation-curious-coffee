import express from 'express';
import FeedbackService from './FeedbackService';
import FeedbackRepository from './FeedbackRepository';
import validation, {checkValidation} from './validation';

const router = express.Router();

const feedbackService = new FeedbackService(new FeedbackRepository());

router.get('/', feedbackService.get);
router.post('/', validation, checkValidation, feedbackService.post);

export = router;