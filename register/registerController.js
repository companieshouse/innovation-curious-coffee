const express = require('express');
const router = express.Router();

const RegisterService = require('./registerService');

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
                req.flash('info', 'Congratulations! You have signed up for #CuriousCoffee. You will receive an email in due course matching you for your #CuriousCoffee date');
                res.redirect('/');
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
    }
});

module.exports = router;