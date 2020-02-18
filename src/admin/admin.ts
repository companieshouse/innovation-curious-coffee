import config from '../config';
import {Request, Response} from 'express';

function get(req: Request, res: Response) {
    return res.render('admin');
}

function post(req: Request, res: Response) {
    if (req.body.password == config.admin.password) {
        res.locals.session.user = true;
        return res.redirect('/');
    } else {
        return res.render('admin', {
                password: req.body.password,
                password_error: "Incorrect password."
        });
    }
}

module.exports.get = get;
module.exports.post = post;