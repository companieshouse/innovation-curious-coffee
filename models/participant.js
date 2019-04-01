var mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    department: String,
    email: String,
    date_registered: Date,
    verify: Boolean,
    matches: [String]
});

var Participant = mongoose.model('Participant', schema, "people");

module.exports = Participant;