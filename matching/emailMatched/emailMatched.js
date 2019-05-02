var express = require('express');
var router = express.Router();
const middleware = require('../../core/middleware/middleware');
const Match = require('../../models/match');

const aws = require('aws-sdk');
aws.config.update({region: 'eu-west-1'});

router.get('/', middleware, function(req, res) {
    res.render('email');
});

router.post('/', middleware, function(req, res) {

    getMatchedParticipants(function(err, matches) {

        if (err) {
            console.error(err);
            return err;
        }

        matches.forEach(function(match) {

            var params = {
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

            var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

            sendPromise.then(function(data) {
                console.log(data.MessageId);
            }).catch(function(err) {
                console.log(err);
            });
        });
    });

    res.redirect('/');
});

function getMatchedParticipants(callback) {
    return Match.find({}, callback);
}

module.exports = router;