import {Request, Response} from 'express';

import config from '../../../config';
import {Email, Params, notify} from '../../../notify';
import Match from '../../../models/match';
import logger from '../../../logger';

export function get(req: Request, res: Response): void {
    logger.info('Rendering page: email');
    return res.render('email');
}

export async function post(req: Request, res: Response): Promise<void> {
    logger.info("Preparing to email matches");

    //Don't attempt to do anything after this if we are in dev mode
    if (config.env === "dev") {
        logger.info("Devmode enabled; redirecing to /");
        return res.redirect('/');
    }

    const matches = await Match.find();

    matches.forEach(function(match) {
        logger.info("Emailing match: " + match);

        const email: Email = {
            sendFrom: "curious-coffee@companieshouse.gov.uk",
            sendTo: [
                match.person_1.email,
                match.person_2.email
            ],
            subject: "It's a match!",
            body: "Congratulations! You have both been matched together to go and get a #CuriousCoffee."
                + " Now its over to you to start the conversation!"
        };
        const params: Params = {
            email: email
        };
        notify(params);
    });

    return res.redirect('/');
}