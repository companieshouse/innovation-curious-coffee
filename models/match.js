var mongoose = require('mongoose');
var ParticipantSchema = mongoose.model('Participant').schema;

const schema = new mongoose.Schema({
    person_1 : ParticipantSchema,
    person_2 : ParticipantSchema
});

var Match = mongoose.model('Match', schema, "matches");

module.exports = Match;