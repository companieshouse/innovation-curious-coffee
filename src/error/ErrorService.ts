import {Request, Response} from 'express';
import logger from '../logger';

export default class ErrorService {
    get = (req: Request, res: Response): void => {
        logger.info("Rendering page: oops");
        return res.render('oops');    
    }
}