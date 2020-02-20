import {Request, Response} from 'express';
import aws from 'aws-sdk';

import config from '../config';
import Participant from '../models/participant';
import logger from '../logger';

aws.config.update({region: 'eu-west-1'});

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
        
        const params = {
            Destination: {
                ToAddresses: [
                    decodedEmail
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: '<p>Congratulations! You have signed up for #CuriousCoffee. You will receive an email in due course matching you for your #CuriousCoffee</p>'
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Sign up confirmed!'
                }
            },
            Source: 'curious-coffee@companieshouse.gov.uk'
        };

        const sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
        sendPromise.then(function(data: aws.SES.Types.SendEmailResponse) {
            logger.info("Email sent, response: " + data);
            
            req.flash('info', 'Congratulations! You have signed up for #CuriousCoffee. You will receive an email in due course matching you for your #CuriousCoffee');
            return res.redirect('/');
        }).catch(function(err) {
            console.error(err, err.stack);
        });
    } else {
        return res.redirect('/');
    }
}