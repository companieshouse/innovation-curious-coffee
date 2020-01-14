var Feedback = require('../models/feedback');

function transformViewToDb(viewFeedback) {
    return new Feedback({
        email: viewFeedback.email,
        feedback: viewFeedback.feedback
    });
};

module.exports.transformViewToDb = transformViewToDb;