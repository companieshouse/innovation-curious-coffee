var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');
const config = require('../config/config');
const mongojs = require('mongojs');
const aws = require('aws-sdk');

const db = mongojs(config.db.name, config.db.collections);
aws.config.update({region: 'eu-west-1'});

router.get('/', middleware, function(req, res) {
    res.render('email');
});

router.post('/', middleware, function(req, res) {

    getMatchedParticipants().then(function(matches) {

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

var getMatchedParticipants = function() {
    
    return new Promise(function(resolve, reject) {
        db.matches.find(function(err, docs) {

            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
};

module.exports = router;