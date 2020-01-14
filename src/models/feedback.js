var mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: String,
    feedback: String
});

var Feedback = mongoose.model('Feedback', schema, "feedback");

module.exports = Feedback;