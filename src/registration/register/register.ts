import {Request, Response} from 'express';

import config from '../../config';
import {Email, Params, notify} from '../../notify';
import Participant from '../../models/participant';
import logger from '../../logger';

export function get(req: Request, res: Response): void {
    logger.info("Rendering page: register");
    return res.render('register');
}

export async function post(req: Request, res: Response): Promise<void> {
    logger.info("Attempting to register new participant");

    const errors = req.validationErrors();

    if (errors) {
        logger.info("Errors in registration data, rendering page: register, with errors");
        res.render('register', {
            name: req.body.name,
            department: req.body.department,
            email: req.body.email,
            consent: req.body.consent,
            errors: errors
        });

        return;
    } else {
    
        logger.info("Validating participant doesn't already exist");
        const participant = await Participant.findOne({
            email: req.body.email
        });
        
        //If the participant is not null, then we need to error as it already exists under that email address
        if (participant !== null) {
            logger.info("Participant already exists");

            const error = {
                msg: 'Email address already registered!',
                param: 'email'
            };

            const resultErrors = [];
            resultErrors.push(error);

            logger.info("Rendering page: register, with errors");

            return res.render('register', {
                name: req.body.name,
                department: req.body.department,
                email: req.body.email,
                consent: req.body.consent,
                errors: resultErrors
                });
        } 

        const newParticipant = new Participant({
            name: req.body.name,
            department: req.body.department,
            email: req.body.email,
            "date_registered": Date.now(),
            verify: false
        });

        logger.info("Registering new participant");
        newParticipant.save();
        logger.info("New participant registered");

        //Don't attempt to do anything after this if we are in dev mode
        if (config.env === "dev") {
            logger.info("Devmode enabled; redirecing to /");
            return res.redirect('/');
        }


        logger.info("Sending email to verify email address of new participant");
        const email: Email = {
            sendFrom: "curious-coffee@companieshouse.gov.uk",
            sendTo: [req.body.email],
            subject: "Verification - Curious Coffee",
            body: "<p>Thank you for registering for #CuriousCoffee. To complete registration, please verify with the link below.</p>"
            + "<br/>"
            + "<a href=\"" + config.verify.url + Buffer.from(req.body.email + config.verify.signature).toString('base64') + "\">Verify</a>"
        };
        const params: Params = {
            email: email
        };
        notify(params);
    
        req.flash('info', 'Thank you for registering for #CuriousCoffee. To complete registration, please verify with the link sent to you in an email.');
        return res.redirect('/');
    }
}