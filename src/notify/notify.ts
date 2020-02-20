import aws from 'aws-sdk';
import config from '../config';
import logger from '../logger';

aws.config.update({
    region: config.aws.region,
});

aws.config.apiVersions = {
    ses: '2010-12-01'
};

const ses = new aws.SES();

export interface Email {
    sendFrom: string;
    sendTo: string[];
    subject: string;
    body: string;
}

export interface Params {
    email?: Email;
}

function emailParamsPresent(params: Params): boolean {
    if (params.email !== undefined) {
        return true;
    } else {
        return false;
    }
}

function getEmailParams(params: Email): aws.SES.Types.SendEmailRequest {
    const formattedParams: aws.SES.Types.SendEmailRequest = {
        Source: params.sendFrom,
        Destination: {
            ToAddresses: params.sendTo
        },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: params.subject
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: params.body
                }
            }
        }
    };

    return formattedParams;
}

function sendEmail(params: aws.SES.Types.SendEmailRequest): void {
    ses.sendEmail(params, function(err, data) {
        if (err) {
            logger.error("Error when sending email: " + err);
            return err;
        } else {
            logger.info("Email sent successfully: " + data);
        }
    });
}

export function notify (params: Params): void {
    if (emailParamsPresent(params)) {
        const emailParams = getEmailParams((params.email as Email));
        sendEmail(emailParams);
    }
}