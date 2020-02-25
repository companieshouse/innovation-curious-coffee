import {Request, Response} from 'express';

import config from '../config';
import {Email, Params, notify} from '../notify';
import Participant from '../participant/ParticipantModel';
import logger from '../logger';

export async function get(req: Request, res: Response): Promise<void> {
    logger.info("Attempting to verify email address");

    //get email to verify
    const decode = req.params;

    logger.info("Decoding email");
    //decode the string from base64 encoded
    const decoded = Buffer.from(decode.email, 'base64').toString('utf8');

    //get signature
    const decodedSignature = decoded.slice(-Math.abs(config.verify.signature.length));
    const decodedEmail = decoded.slice(0, decoded.length - config.verify.signature.length);

    if (decodedEmail.length == 0) {
        logger.info("Email is empty, redirecting to /");
        return res.redirect('/');
    }

    if (decodedSignature.length == 0) {
        logger.info("Signature is empty, redirecting to /");
        return res.redirect('/');
    }

    if (decodedSignature == config.verify.signature) {
        logger.info("Verification confirmed, updating participant info");
        await Participant.updateOne({
            email: decodedEmail
        }, {
            $set: {
                verify: true
            }
        });

        //Don't attempt to do anything after this if we are in dev mode
        if (config.env === "dev") {
            logger.info("Devmode enabled; redirecing to /");
            return res.redirect('/');
        }

        logger.info("Sending verified email");
        const email: Email = {
            sendFrom: "curious-coffee@companieshouse.gov.uk",
            sendTo: [decodedEmail],
            subject: "Registration confirmed!",
            body: "<p>Congratulations! You have signed up for #CuriousCoffee. You will receive an email in due course matching you for your #CuriousCoffee</p>"
        };
        const params: Params = {
            email: email
        };
        notify(params);

        req.flash('info', 'Congratulations! You have signed up for #CuriousCoffee. You will receive an email in due course matching you for your #CuriousCoffee');
        return res.redirect('/');
    } else {
        return res.redirect('/');
    }
}