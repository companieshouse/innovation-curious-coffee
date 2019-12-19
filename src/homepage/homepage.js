const Participant = require('../../models/participant');

async function get(req, res) {
    let numParticipants = await getParticipantCount();
    let numMatches = await getMatchCount();

    res.render('index', {
        numParticipants: numParticipants, 
        numMatches: numMatches, 
        messages: req.flash('info')
    });
}

function getParticipantCount() {
    return Participant.countDocuments({verify: true});
}

function getParticipantsMatches() {
    return Participant.find({verify: true, matches: {$exists: true}});
}

async function getMatchCount() {
    let participants = await getParticipantsMatches();

    let count = 0;

    participants.forEach(element => {
        count += element.matches.length;
    });

    return Math.round(count / 2);
}

module.exports.get = get;