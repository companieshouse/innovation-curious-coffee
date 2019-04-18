const Participant = require('../models/participant');

class ParticipantsService {

    getParticipants(callback) {

        return Participant.find().sort({date_registered: 1}).exec(callback);
    };
};

module.exports = ParticipantsService;