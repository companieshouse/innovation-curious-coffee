const express = require('express');
const router = express.Router();
const config =  require('../../config/config.js');
const aws = require('aws-sdk');
const Participant = require('../../models/participant');

aws.config.update({region: 'eu-west-1'});

router.get('/:email', function(req, res) {

    //get email to verify
    var decode = req.params;

    //decode the string from base64 encoded
    var decoded = Buffer.from(decode.email, 'base64').toString('utf8');

    //get signature
    var decodedSignature = decoded.slice(-Math.abs(config.verify.signature.length));
    var decodedEmail = decoded.slice(0, decoded.length - config.verify.signature.length);

    if (decodedEmail.length == 0) {
        console.log('decodedEmail is empty');
        res.redirect('/');
    }

    if (decodedSignature.length == 0) {
        console.log('decodedSignature is empty');
        res.redirect('/');
    }

    if (decodedSignature == config.verify.signature) {
        verifyEmail(decodedEmail).then(function() {
            var params = {
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

            console.log('Sending email to address ' + decodedEmail);
        
            var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
        
            sendPromise.then(function(data) {
                console.log(data.MessageId);
        
                req.flash('info', 'Congratulations! You have signed up for #CuriousCoffee. You will receive an email in due course matching you for your #CuriousCoffee');
                res.redirect('/');
            }).catch(function(err) {
                console.error(err, err.stack);
            });
        });
    } else {
        res.redirect('/');
    }
});

function verifyEmail(decodedEmail) {

    return Participant.updateOne({email: decodedEmail}, {$set: {verify: true}});
};

module.exports = router;