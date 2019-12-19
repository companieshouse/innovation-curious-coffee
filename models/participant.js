var mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    department: String,
    email: String,
    date_registered: Date,
    verify: Boolean,
    matches: [String]
});

schema.statics.getAllVerifiedParticipants = async function() {
    return this.find({verify: true})
            .collation({ locale: "en" })
            .sort({email: 1});
};

var Participant = mongoose.model('Participant', schema, "people");

module.exports = Participant;