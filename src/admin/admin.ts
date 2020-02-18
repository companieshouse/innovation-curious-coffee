import config from '../config';
import {Request, Response} from 'express';

export function get(req: Request, res: Response): void {
    return res.render('admin');
}

export function post(req: Request, res: Response): void {
    if (req.body.password == config.admin.password) {
        res.locals.session.user = true;
        return res.redirect('/');
    } else {
        return res.render('admin', {
                password: req.body.password,
                passwordError: "Incorrect password."
        });
    }
}