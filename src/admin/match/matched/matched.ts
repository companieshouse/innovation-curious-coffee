import {Request, Response} from 'express';

import Match from '../../../models/match';
import logger from '../../../logger';

export async function get(req: Request, res: Response): Promise<void> {

    logger.info('Rendering page: matched');
    const matches = await Match.find();

    return res.render('matched', {
        matches: matches
    });
}