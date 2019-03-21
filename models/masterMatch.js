var mongoose = require('mongoose');
var ParticipantSchema = mongoose.model('Participant').schema;

const schema = new mongoose.Schema({
    participant : ParticipantSchema,
    matches : [ParticipantSchema]
});

var MasterMatch = mongoose.model('MasterMatch', schema, "master_matches");

module.exports = MasterMatch;