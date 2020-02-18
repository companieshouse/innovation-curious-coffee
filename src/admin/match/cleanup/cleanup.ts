import {Request, Response} from 'express';
import Match from '../../../models/match';

export function get(req: Request, res: Response): void {
    return res.render('cleanup');
}

export function post(req: Request, res: Response): void {
    Match.deleteMany({}, function(err) {
        if (err) {
            console.error(err);
            return err;
        }
    });

    return res.redirect('/');
}