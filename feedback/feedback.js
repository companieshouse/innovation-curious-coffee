var express = require('express');
var router = express.Router();
var Feedback = require('../models/feedback');

router.get('/', function(req, res) {
    res.render('feedback');
});

router.post('/', function(req, res) {

    req.checkBody('email', 'Please enter a valid email address').isEmail();
    req.checkBody('feedback', 'Please enter some feedback').isLength({min:1}).trim();

    var errors = req.validationErrors();

    if (errors) {

        var email_error;
        var feedback_error;

        errors.forEach(function(error) {
            if ("email" == error.param) {
                email_error = true;
            } else if ("feedback" == error.param) {
                feedback_error = true;
            }
        });

        return res.render('feedback', {
            email: req.body.email,
            email_error: email_error,
            feedback: req.body.feedback,
            feedback_error: feedback_error,
            errors: errors
        });
    } else {
        insert(req.body.email, req.body.feedback, function(err, doc) {

            if (err) {
                console.error(err);
                return err;
            }

            req.flash('info', 'Thank you for your feedback!');
            return res.redirect('/');
        });
    }
});

function insert(email, feedback, callback) {

    var feedback = new Feedback({
        email: email,
        feedback: feedback
    });

    return feedback.save(callback);
}

module.exports = router;