var express = require('express');
var router = express.Router();
const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

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

        res.render('feedback', {
            email: req.body.email,
            email_error: email_error,
            feedback: req.body.feedback,
            feedback_error: feedback_error,
            errors: errors
        });

        return;
    } else {
        insert(req).then(function() {
            res.redirect('/');
        });
    }
});

var insert = function(req) {
    return new Promise(function(resolve, reject) {
        db.feedback.insert({
            email: req.body.email,
            feedback: req.body.feedback,
        }, function(err, doc) {

            if (err) {
                reject(err);
            }

            resolve(doc);
        });
    });
};

module.exports = router;