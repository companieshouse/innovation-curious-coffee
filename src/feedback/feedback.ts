import {Request, Response} from 'express';
import Feedback, {InterfaceFeedback} from '../models/feedback';
import logger from '../logger';

export function get(req: Request, res: Response): void {
    logger.info("Rendering page: feedback");
    return res.render('feedback', {
        feedbackModel: new Feedback()
    });
}

export async function post(req: Request, res: Response): Promise<void> {
    logger.info("Attempting to save feedback");

    const errors = req.validationErrors();

    if (errors) {

        logger.info("Errors in feedback data, rendering page: feedback");

        return res.render('feedback', {
            feedbackModel: req.body.feedbackModel,
            errors: errors
        });
    } else {

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