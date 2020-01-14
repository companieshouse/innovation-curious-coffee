const Participant = require('../../../models/participant');

async function get(req, res) {

    let options = await Participant.find({verify: true});

    return res.render('remove', {options: options});
};

function post(req, res) {

    if (req.body.email === '' || req.body.email === undefined) {
        error = new Error("Email undefined!");
        console.error(error);
        return err;
    }

    Participant.deleteOne({email: req.body.email}, function(err) {
        if (err) {
            console.error(error);
            return err;
        }
    });

    res.redirect('/');
};

module.exports.get = get;
module.exports.post = post;