import { Request, Response } from 'express';
import logger from '../logger';

export default class FaqService {
    get = (req: Request, res: Response): void => {
        logger.info("Rendering page: faq");
        return res.render('faq');
    };
}
