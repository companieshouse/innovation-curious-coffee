const Participant = require('../models/participant');

async function get(req, res) {
    let numParticipants = await Participant.countDocuments({verify: true});
    let numMatches = await getMatchCount();

    res.render('homepage', {
        homepageModel: {
            numParticipants: numParticipants,
            numMatches: numMatches
        },
        messages: req.flash('info')
    });
}

async function getMatchCount() {
    let participants = await Participant.find({verify: true, matches: {$exists: true}});

    let count = 0;

    participants.forEach(element => {
        count += element.matches.length;
    });

    return Math.round(count / 2);
}

module.exports.get = get;