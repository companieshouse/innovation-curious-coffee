import config from '../config';
import { Request, Response } from 'express';
import logger from '../logger';

export default class AdminService {

    public get = (req: Request, res: Response): void => {
        logger.info('Rendering page: admin');
        return res.render('admin');
    };

    public post = (req: Request, res: Response): void => {
        logger.info('Validating password');

        if (req.body.password === config.admin.password) {
            logger.info('Password validated');

            res.locals.session.user = true;
            return res.redirect('/');
        } else {
            logger.info('Invalid password, rendering page: admin');
            return res.render('admin', {
                password: req.body.password,
                passwordError: "Incorrect password."
            });
        }
    };
}
