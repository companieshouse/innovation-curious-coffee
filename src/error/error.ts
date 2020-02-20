import {Request, Response} from 'express';
import logger from '../logger';

export function get(req: Request, res: Response): void {
    logger.info("Rendering page: oops");
    return res.render('oops');
}