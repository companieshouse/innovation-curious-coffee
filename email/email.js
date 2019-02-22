var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');

var nodemailer = require('nodemailer');

const dbname = 'matches';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

var fs = require('fs');

var transporter = nodemailer.createTransport(require('./email_config.json'));
var mailOptionsJSON = require('./email_mail_options.json');

router.get('/', middleware, function(req, res) {
    res.render('email');
});

router.post('/', middleware, function(req, res) {

    getMatchedParticipants().then(function(matches) {

        matches.forEach(function(match) {
            var to = match.person_1.name + ' <' + match.person_1.email + '>, ' + 
                        match.person_2.name + ' <' + match.person_2.email + '>';

            var mailOptions = {
                from: mailOptionsJSON.from,
                to: to,
                subject: 'It\'s a match!',
                text: 'Congratulations! You have both been matched together to go and get a #CuriousCoffee',
                auth: {
                    user: mailOptionsJSON.auth.user,
                    refreshToken: mailOptionsJSON.auth.refreshToken, 
                    accessToken: mailOptionsJSON.auth.accessToken,
                    scope: mailOptionsJSON.auth.scope,
                }
            };
    
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
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