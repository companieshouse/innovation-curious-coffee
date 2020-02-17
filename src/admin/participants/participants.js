"use strict";

const Participant = require('../../models/participant');

async function get(req, res) {

    let participants = await Participant.find({verify: true}).sort({date_registered: 1});
    
    return res.render('participants', {
        participants: participants 
     });
}

module.exports.get = get;