const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');
const Match = require('../../models/match');
const Participant = require('../../models/participant');

router.get('/:id', middleware, function(req, res) {

    console.log('Getting match at id: ', req.params.id);

    getMatch(req.params.id, function(err, match) {

        if (err) {
            console.log(err);
            return res.redirect('/oops');
        }

        getParticipantEmails(function(err, options) {
            if (err) {
                console.log(err);
                return res.redirect('/oops');
            }

            return res.render('match-edit', {match: match, options: options, messages: req.flash('info')});
        });
    });
});

router.post('/:id', middleware, function(req, res) {

    console.log('Posting updated match at id: ', req.params.id);

    let match1 = {
        name: req.body.match1name,
        email: req.body.match1email,
        department: req.body.match1department
    };

    let match2 = {
        name: req.body.match2name,
        email: req.body.match2email,
        department: req.body.match2department
    }

    if (match1.email == match2.email) {
        req.flash('info', "You cannot match somebody with themselves!");
        return res.redirect('/match-edit/' + req.params.id);
    } else if (match1.department == match2.department) {
        req.flash('info', "You cannot match people within the same department");
        return res.redirect('/match-edit/' + req.params.id);
    } else {
        getMatch(req.params.id, function(err, match) {
            if (err) {
                console.log(err);
                return res.redirect('/oops');
            }

            match.person_1.name = match1.name;
            match.person_1.email = match1.email;
            match.person_1.department = match1.department;

            match.person_2.name = match2.name;
            match.person_2.email = match2.email;
            match.person_2.department = match2.department;

            match.save();

            req.flash('info', 'Match updated successfully. Please check the matched list to ensure there are no duplicates as a result of your change.');
            return res.redirect('/');
        });
    }
});

router.get('/data/:email', middleware, function(req, res) {

    res.setHeader('Content-Type', 'application/json');

    console.log('Query fired, email: ', req.params.email);

    getParticipant(req.params.email, function(err, participant) {
        
        if (err) {
            console.log(err);
            return res.redirect('/oops');
        }

        return res.send({data: participant});
    });
});

function getMatch(id, callback) {
    return Match.findById(id, callback);
}

function getParticipantEmails(callback) {
    return Participant.find({verify: true}, 'email', callback);
};

function getParticipant(email, callback) {
    return Participant.findOne({email: email}, callback);
}

module.exports = router;