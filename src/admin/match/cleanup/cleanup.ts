import {Request, Response} from 'express';
import Match from '../../../models/match';
import logger from '../../../logger';

export function get(req: Request, res: Response): void {

    logger.info('Rendering page: cleanup');
    return res.render('cleanup');
}

export async function post(req: Request, res: Response): Promise<void> {

    logger.info('Deleting all matches');
    await Match.deleteMany({});

    return res.redirect('/');
}