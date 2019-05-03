const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');
const Match = require('../../models/match');
const Participant = require('../../models/participant');

router.get('/:id', middleware, get);

async function get(req, res) {

    console.log('Getting match at id: ', req.params.id);

    let match = await getMatch(req.params.id);
    let options = await getParticipantEmails();

    return res.render('match-edit', {match: match, options: options, messages: req.flash('info')});
};

router.post('/:id', middleware, post);

async function post(req, res) {

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
        let match = await getMatch(req.params.id);

        //remove old matches from list
        await Participant.update({email: match.person_1.email}, {$pull: {matches: match.person_2.email}});
        await Participant.update({email: match.person_2.email}, {$pull: {matches: match.person_1.email}});

        match.person_1.name = match1.name;
        match.person_1.email = match1.email;
        match.person_1.department = match1.department;

        match.person_2.name = match2.name;
        match.person_2.email = match2.email;
        match.person_2.department = match2.department;

        match.save();

        //add new matches to lists
        await Participant.update({email: match1.email}, {$push: {matches: match2.email}});
        await Participant.update({email: match2.email}, {$push: {matches: match1.email}});

        req.flash('info', 'Match updated successfully. Please check the matched list to ensure there are no duplicates as a result of your change.');
        return res.redirect('/');
    }
};

router.get('/data/:email', middleware, getData);

async function getData(req, res) {

    res.setHeader('Content-Type', 'application/json');

    console.log('Query fired, email: ', req.params.email);

    let participant = await getParticipant(req.params.email);

    return res.send({data: participant});
};

function getMatch(id) {
    return Match.findById(id);
};

function getParticipantEmails() {
    return Participant.find({verify: true}, 'email');
};

function getParticipant(email) {
    return Participant.findOne({email: email});
};

module.exports = router;