const express = require('express');
const router = express.Router();

const dbname = 'people';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

router.get('/', function(req, res) {
    res.render('register');
});

router.post('/', function(req, res) {

    req.checkBody('name', 'Name cannot be blank').isLength({min:1}).trim();
    req.checkBody('email', 'Please enter a valid email address').isEmail();
    req.checkBody('department', 'Please select a department').departmentError();

    var errors = req.validationErrors();

    if (errors) {

        var name_error;
        var email_error;
        var department_error;

        errors.forEach(function(error) {
            if ("name" == error.param) {
                name_error = true;
            } else if ("email" == error.param) {
                email_error = true;
            } else if ("department" == error.param) {
                department_error = true;
            }
        });

        res.render('register', {
            name: req.body.name,
            name_error: name_error,
            department: req.body.department,
            department_error: department_error,
            email: req.body.email,
            email_error: email_error,
            repeat: req.body.repeat,
            errors: errors
        });

        return;
    } else {
        checkRegistered(req).then(function() {

            insert(req).then(function(doc) {
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
                    repeat: req.body.repeat,
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
                repeat: req.body.repeat,
                errors: errors
            });
        });
    }
});

var checkRegistered = function(req) {

    return new Promise(function(resolve, reject) {
        db.people.find({email: req.body.email}, function(err, docs) {
            if (docs.length < 1) {
                resolve(docs);
            } else {
                reject(err);
            }
        })
    });
}

var insert = function(req) {
    return new Promise(function(resolve, reject) {
        db.people.insert({
            name: req.body.name,
            department: req.body.department,
            email: req.body.email,
            repeat: req.body.repeat
        }, function(err, doc) {

            if (err) {
                reject(err);
            }

            resolve(doc);
        });
    });
};

module.exports = router;