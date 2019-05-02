const express = require('express');
const router = express.Router();
const config =  require('../../config/config.js');
const middleware = require('../../core/middleware/middleware');

const mongojs = require('mongojs');
const db = mongojs(config.db.name, config.db.collections);

const aws = require('aws-sdk');
aws.config.update({region: 'eu-west-1'});

router.get('/', middleware, function(req, res) {
    res.render('verifyAll');
});

router.post('/', middleware, function(req, res) {

    findUnverified().then(function(docs) {
        docs.forEach(function(doc) {

            console.log('preparing email for ' + doc.email);

            var params = {
                Destination: {
                    ToAddresses: [
                        doc.email
                    ]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: '<p>Thank you for registering for #CuriousCoffee. To complete registration, please verify with the link below.</p>'
                            + '<br/>'
                            + '<a href="' + config.verify.url + Buffer.from(doc.email + config.verify.signature).toString('base64') + '">Verify</a>'
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Verification - Curious Coffee'
                    }
                },
                Source: 'curious-coffee@companieshouse.gov.uk'
            };

            console.log("Param set up" + params);

            var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

            console.log("Send promise due to send");

            sendPromise.then(function(data) {
                console.log(data.MessageId);
            }).catch(function(err) {
                console.error(err, err.stack);
            });
        });
    });

    res.redirect('/');
});

function findUnverified() {

    return new Promise(function(resolve, reject) {
        db.people.find({verify: false}, function(err, docs) {
            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
};

module.exports = router;