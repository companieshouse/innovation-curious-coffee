import {Request, Response} from 'express';

export function get(req: Request, res: Response): void {
    return res.render('faq');
}