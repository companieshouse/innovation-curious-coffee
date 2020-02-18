import {Request, Response} from 'express';
import aws from 'aws-sdk';

import config from '../../config';
import Participant from '../../models/participant';

aws.config.update({region: 'eu-west-1'});

export function get(req: Request, res: Response): void {
    return res.render('register');
}

export async function post(req: Request, res: Response): Promise<void> {

    const errors = req.validationErrors();

    if (errors) {

        let nameError;
        let emailError;
        let departmentError;
        let consentError;

        errors.forEach(function(error: any) {
            if ("name" == error.param) {
                nameError = true;
            } else if ("email" == error.param) {
                emailError = true;
            } else if ("department" == error.param) {
                departmentError = true;
            } else if ("consent" == error.param) {
                consentError = true;
            }
        });

        res.render('register', {
            name: req.body.name,
            "name_error": nameError,
            department: req.body.department,
            "department_error": departmentError,
            email: req.body.email,
            "email_error": emailError,
            consent: req.body.consent,
            "consent_error": consentError,
            errors: errors
        });

        return;
    } else {
    
        const participant = await Participant.findOne({email: req.body.email});
        
        //If the participant is not null, then we need to error as it already exists under that email address
        if (participant !== null) {

            const error = {
                msg: 'Email address already registered!',
                param: 'email'
            };

            const resultErrors = [];
            resultErrors.push(error);

            return res.render('register', {
                name: req.body.name,
                department: req.body.department,
                email: req.body.email,
                consent: req.body.consent,
                errors: resultErrors,
                "email_error": true
                });
        } 

        const newParticipant = new Participant({
            name: req.body.name,
            department: req.body.department,
            email: req.body.email,
            "date_registered": Date.now(),
            verify: false
        });

        newParticipant.save();

        //Don't attempt to do anything after this if we are in dev mode
        if (config.devmode) {
            return res.redirect('/');
        }

        const params = {
            Destination: {
                ToAddresses: [
                    req.body.email
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: '<p>Thank you for registering for #CuriousCoffee. To complete registration, please verify with the link below.</p>'
                        + '<br/>'
                        + '<a href="' + config.verify.url + Buffer.from(req.body.email + config.verify.signature).toString('base64') + '">Verify</a>'
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Verification - Curious Coffee'
                }
            },
            Source: 'curious-coffee@companieshouse.gov.uk'
        };

        const sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        sendPromise.then(function(data) {
            console.log(data);

            req.flash('info', 'Thank you for registering for #CuriousCoffee. To complete registration, please verify with the link sent to you in an email.');
            return res.redirect('/');
        }).catch(function(err) {
            console.error(err, err.stack);
            return res.redirect('/oops');
        });
    }
}