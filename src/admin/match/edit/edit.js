"use strict";

const Match = require('../../../models/match');
const Participant = require('../../../models/participant');

async function get(req, res) {

    let match = await Match.findById(req.params.id);
    let options = await Participant.find({verify: true});

    return res.render('match-edit', {match: match, options: options, messages: req.flash('info')});
}

async function post(req, res) {

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
        let match = await Match.findById(req.params.id);

        //remove old matches from list
        await Participant.updateOne({email: match.person_1.email}, {$pull: {matches: match.person_2.email}});
        await Participant.updateOne({email: match.person_2.email}, {$pull: {matches: match.person_1.email}});

        match.person_1.name = match1.name;
        match.person_1.email = match1.email;
        match.person_1.department = match1.department;

        match.person_2.name = match2.name;
        match.person_2.email = match2.email;
        match.person_2.department = match2.department;

        match.save();

        //add new matches to lists
        await Participant.updateOne({email: match1.email}, {$push: {matches: match2.email}});
        await Participant.updateOne({email: match2.email}, {$push: {matches: match1.email}});

        req.flash('info', 'Match updated successfully. Please check the matched list to ensure there are no duplicates as a result of your change.');
        return res.redirect('/');
    }
}

async function getData(req, res) {

    res.setHeader('Content-Type', 'application/json');

    let participant = await Participant.findOne({email: req.params.email});

    return res.send({data: participant});
}

module.exports.get = get;
module.exports.post = post;
module.exports.getData = getData;