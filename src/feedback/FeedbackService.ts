import { Request, Response } from 'express';
import logger from '../logger';
import { FeedbackRepository } from './FeedbackRepository';

export default class FeedbackService {
    constructor(private repository: FeedbackRepository) {
    }

    public get = (req: Request, res: Response): void => {
        logger.info("Rendering page: feedback");
        return res.render('feedback');
    };

    public post = async (req: Request, res: Response): Promise<void> => {
        logger.info("Attempting to save feedback");

        await this.repository.save(req.body.feedbackModel);

        req.flash('info', 'Thank you for your feedback!');
        return res.redirect('/');
    };
}
