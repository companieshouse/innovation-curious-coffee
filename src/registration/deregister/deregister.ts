import {Request, Response} from 'express';

import Participant from '../../models/participant';
import logger from '../../logger';

export function get(req: Request, res: Response): void {
    logger.info("Rendering page: deregister");
    return res.render('deregister');
}

export async function post(req: Request, res: Response): Promise<void> { 
    logger.info("Attempting to deregister participant");
    const errors = req.validationErrors();

    if (errors) {
        logger.info("Errors in deregister form, rendering page: deregister, with errors");

        return res.render('deregister', {
            email: req.body.email,
            errors: errors
        });
    }

    const result = Participant.findOne({
        email: req.body.email
    });

    if (result === null) {
        logger.info("Participant doesn't exist, rendering page: deregister, with errors");
        const error = {
            msg: 'Email address does not exist!',
            param: 'email'
        };

        const resultErrors = [];
        resultErrors.push(error);

        return res.render('deregister', {
            email: req.body.email,
            errors: resultErrors
        });
    }

    logger.info("Deleting participant");
    await Participant.deleteOne({
        email: req.body.email
    });
    logger.info("Participant deleted");

    req.flash('info', 'You have now deregistered. If you wish to get involved again, simply re-register.');
    return res.redirect('/');
}