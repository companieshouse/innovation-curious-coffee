const Participant = require('../../models/participant');

class ParticipantsService {

    getParticipants() {

        return Participant.find().sort({date_registered: 1});
    };
};

module.exports = ParticipantsService;