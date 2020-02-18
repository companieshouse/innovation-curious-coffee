import {Request, Response} from 'express';

import Match from '../../../models/match';

export async function get(req: Request, res: Response): Promise<void> {
    const matches = await Match.find();

    return res.render('matched', {
        matches: matches
    });
}