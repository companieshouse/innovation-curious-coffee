import {Request, Response} from 'express';
import aws from 'aws-sdk';

import Match from '../../../models/match';

aws.config.update({region: 'eu-west-1'});

export function get(req: Request, res: Response): void {
    return res.render('email');
}

export async function post(req: Request, res: Response): Promise<void> {
    const matches = await Match.find();

    matches.forEach(function(match) {

        const params = {
            Destination: {
                ToAddresses: [
                    match.person_1.email,
                    match.person_2.email
                ]
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: 'Congratulations! You have both been matched together to go and get a #CuriousCoffee. Now its over to you to start the conversation!'
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'It\'s a match!'
                }
            },
            Source: 'curious-coffee@companieshouse.gov.uk'
        };

        const sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        sendPromise.then(function(data) {
            console.log(data.MessageId);
        }).catch(function(err) {
            console.log(err);
        });
    });

    return res.redirect('/');
}