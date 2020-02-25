import {Request, Response} from 'express';
import Feedback, {InterfaceFeedback} from '../models/feedback';
import logger from '../logger';
import {InterfaceFeedbackRepository} from '../repository/FeedbackRepository';

export default class FeedbackService {

    private repository: InterfaceFeedbackRepository;

    constructor(repository: InterfaceFeedbackRepository) {
        this.repository = repository;
    }

    private validateData(req: Request, res: Response): void {
        const errors = req.validationErrors();

        if (errors) {
            logger.info("Errors in feedback data, rendering page: feedback");
            return res.render('feedback', {
                feedbackModel: req.body.feedbackModel,
                errors: errors
            });
        } else {
            return;
        }
    }

    public get(req: Request, res: Response): void {
        logger.info("Rendering page: feedback");
        return res.render('feedback');
    }

    public async post(req: Request, res: Response): Promise<void> {
        logger.info("Attempting to save feedback");

        this.validateData(req, res);

        logger.info("Saving feedback");

        const feedback: InterfaceFeedback = new Feedback({
            email: req.body.feedbackModel.email,
            feedback: req.body.feedbackModel.feedback
        });

        feedback.save();

        logger.info("Feedback saved");

        req.flash('info', 'Thank you for your feedback!');
        return res.redirect('/');
    }
}