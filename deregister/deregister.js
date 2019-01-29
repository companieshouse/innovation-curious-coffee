const express = require('express');
const router = express.Router();

const dbname = 'people';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

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

        res.render('deregister', {
            email: req.body.email,
            email_error: email_error,
            errors: errors
        });

        return;
    } else {
        checkRegistered(req).then(function() {
            deleteUser(req).then(function() {
                res.redirect('/');
            });
        });
    }
});

var checkRegistered = function(req) {

    return new Promise(function(resolve, reject) {
        db.people.find({email: req.body.email}, function(err, docs) {

            if (err) {
                reject(err);
            }

            if (docs.length > 0) {
                resolve(docs);
            } else {
                reject(new Error('A participant with this email address does not exist!'));
            }
        })
    });
}

var deleteUser = function(req) {
    
    return new Promise(function(resolve, reject) {
        db.people.remove({"email": req.body.email}, function(err, result) {

            if (err) {
                reject();
            }

            resolve(result);
        });
    });
}

module.exports = router;