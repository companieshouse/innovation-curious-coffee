const {transformViewToDb} = require('./transform');

var ViewFeedback = require('../models/view/feedback');

function get(req, res) {
    return res.render('feedback', {
        feedbackModel: ViewFeedback
    });
};

async function post(req, res) {

    req.checkBody('feedbackModel[email]', 'Please enter a valid email address').isEmail();
    req.checkBody('feedbackModel[feedback]', 'Please enter some feedback').isLength({min:1}).trim();

    var errors = req.validationErrors();

    if (errors) {

        return res.render('feedback', {
            feedbackModel: req.body.feedbackModel,
            errors: errors
        });
    } else {

        await transformViewToDb(req.body.feedbackModel).save();

        req.flash('info', 'Thank you for your feedback!');
        return res.redirect('/');
    }
};

module.exports.get = get;
module.exports.post = post;