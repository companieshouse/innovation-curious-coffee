var mongoose = require('mongoose');

const schema = new mongoose.Schema({
    person_1 : {
        name: String,
        email: String,
        department: String
    },
    person_2 : {
        name: String,
        email: String,
        department: String
    }
});

var Match = mongoose.model('Match', schema, "matches");

module.exports = Match;