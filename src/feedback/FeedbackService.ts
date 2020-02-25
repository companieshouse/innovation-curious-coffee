import {Request, Response} from 'express';
import logger from '../logger';
import {InterfaceFeedbackRepository} from './FeedbackRepository';

export default class FeedbackService {

    private _repository: InterfaceFeedbackRepository;

    constructor(repository: InterfaceFeedbackRepository) {
        this._repository = repository;
    }

    public get = (req: Request, res: Response): void => {
        logger.info("Rendering page: feedback");
        return res.render('feedback');
    }

    public post = async (req: Request, res: Response): Promise<void> => {
        logger.info("Attempting to save feedback");

        this._repository.save(req.body.feedbackModel.email, req.body.feedbackModel.feedback);

        req.flash('info', 'Thank you for your feedback!');
        return res.redirect('/');
    }
}