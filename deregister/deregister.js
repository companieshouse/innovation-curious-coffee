const express = require('express');
const router = express.Router();
const Participant = require('../models/participant');

router.get('/', function(req, res) {
    res.render('deregister');
});

router.post('/', function(req, res) { 
    req.checkBody('email', 'Please enter a valid email address').isEmail();

    var errors = req.validationErrors();

    if (errors) {

        var email_error;

        errors.forEach(function(error) {
            if ("email" == error.param) {
                email_error = true;
            }
        });

        return res.render('deregister', {
            email: req.body.email,
            email_error: email_error,
            errors: errors
        });
    }

    checkRegistered(req.body.email, function(err, result) {
        if (err) {
            console.error(err);
            res.redirect('/oops');
        }

        if (result === null) {

            var errors = [];
            errors.push(getEmailError());

            return res.render('deregister', {
                email: req.body.email,
                email_error: true,
                errors: errors
            });
        }

        removeParticipant(req.body.email, function(err, result) {
            if (err) {
                console.error(error);
                return res.redirect('/oops');
            }
    
            req.flash('info', 'You have now deregistered. If you wish to get involved again, simply re-register.');
            return res.redirect('/');
        });
    });
});

function checkRegistered(email, callback) {
    return Participant.findOne({email: email}).exec(callback);
}

function removeParticipant(email, callback) {
    return Participant.deleteOne({email: email}).exec(callback);
}

function getEmailError() {

    var error = {
        msg: 'Email address does not exist!',
        param: 'email'
    };

    return error;
};

module.exports = router;