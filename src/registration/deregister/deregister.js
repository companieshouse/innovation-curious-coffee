const Participant = require('../../models/participant');

function get(req, res) {
    return res.render('deregister');
}

async function post(req, res) { 
    req.checkBody('email', 'Please enter a valid email address').isEmail();

    var errors = req.validationErrors();

    if (errors) {

        var email_error;

        errors.forEach(function(error) {
            if ("email" == error.param) {
                email_error = true;
            }
        });

        return res.render('deregister', {
            email: req.body.email,
            email_error: email_error,
            errors: errors
        });
    }

    let result = Participant.findOne({email: email});

    if (result === null) {

        var error = {
            msg: 'Email address does not exist!',
            param: 'email'
        };

        var errors = [];
        errors.push(error);

        return res.render('deregister', {
            email: req.body.email,
            email_error: true,
            errors: errors
        });
    }

    await Participant.deleteOne({email: email});

    req.flash('info', 'You have now deregistered. If you wish to get involved again, simply re-register.');
    return res.redirect('/');
};

module.exports.get = get;
module.exports.post = post;