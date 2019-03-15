const Participant = require('../models/participant');

class ParticipantsService {

    getParticipants(callback) {

        return Participant.find().sort({department: 1}).exec(callback);
    };
};

module.exports = ParticipantsService;