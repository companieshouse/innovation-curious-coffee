const express = require('express');
const router = express.Router();
const config = require('../config/config');

const RegisterService = require('./registerService');

const aws = require('aws-sdk');

aws.config.update({region: 'eu-west-1'});

router.get('/', function(req, res) {
    res.render('register');
});

router.post('/', function(req, res) {

    req.checkBody('name', 'Name cannot be blank').isLength({min:1}).trim();
    req.checkBody('email', 'Please enter a valid email address').isEmail();
    req.checkBody('department', 'Please select a department').departmentError();
    req.checkBody('consent', 'You must consent for your data to be used to register').consentChecked();

    var errors = req.validationErrors();

    if (errors) {

        var name_error;
        var email_error;
        var department_error;
        var consent_error;

        errors.forEach(function(error) {
            if ("name" == error.param) {
                name_error = true;
            } else if ("email" == error.param) {
                email_error = true;
            } else if ("department" == error.param) {
                department_error = true;
            } else if ("consent" == error.param) {
                consent_error = true;
            }
        });

        res.render('register', {
            name: req.body.name,
            name_error: name_error,
            department: req.body.department,
            department_error: department_error,
            email: req.body.email,
            email_error: email_error,
            consent: req.body.consent,
            consent_error: consent_error,
            errors: errors
        });

        return;
    } else {
        var registerService = new RegisterService();
        registerService.checkRegistered(req.body.email).then(function() {

            registerService.insert(req.body.name, req.body.department, req.body.email).then(function(doc) {

                var params = {
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

                console.log("Param set up" + params);

                var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

                console.log("Send promise due to send");

                sendPromise.then(function(data) {
                    console.log(data.MessageId);

                    req.flash('info', 'Thank you for registering for #CuriousCoffee. To complete registration, please verify with the link sent to you in an email.');
                    res.redirect('/');
                }).catch(function(err) {
                    console.error(err, err.stack);
                });
            }).catch(function(err) {
                var error = {
                    msg: err.message
                };
    
                var errors = [];
                errors.push(error);
    
                res.render('register', {
                    name: req.body.name,
                    department: req.body.department,
                    email: req.body.email,
                    consent: req.body.consent,
                    errors: errors
                });
            });

        }).catch(function(err) {
            var error = {
                msg: err.message,
                param: 'email'
            };

            var errors = [];
            errors.push(error);

            res.render('register', {
                name: req.body.name,
                department: req.body.department,
                email: req.body.email,
                consent: req.body.consent,
                errors: errors,
                email_error: true
            });
        });
    }

    res.redirect('/');
});

module.exports = router;