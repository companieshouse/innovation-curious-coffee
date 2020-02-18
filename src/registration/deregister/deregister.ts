import {Request, Response} from 'express';

import Participant from '../../models/participant';

export function get(req: Request, res: Response): void {
    return res.render('deregister');
}

export async function post(req: Request, res: Response): Promise<void> { 
    const errors = req.validationErrors();

    if (errors) {

        let emailError;

        errors.forEach(function(error: any) {
            if ("email" == error.param) {
                emailError = true;
            }
        });

        return res.render('deregister', {
            email: req.body.email,
            "email_error": emailError,
            errors: errors
        });
    }

    const result = Participant.findOne({email: req.body.email});

    if (result === null) {

        const error = {
            msg: 'Email address does not exist!',
            param: 'email'
        };

        const resultErrors = [];
        resultErrors.push(error);

        return res.render('deregister', {
            email: req.body.email,
            "email_error": true,
            errors: resultErrors
        });
    }

    await Participant.deleteOne({email: req.body.email});

    req.flash('info', 'You have now deregistered. If you wish to get involved again, simply re-register.');
    return res.redirect('/');
}