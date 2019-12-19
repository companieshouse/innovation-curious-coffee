const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');
const Participant = require('../../models/participant');

router.get('/', middleware, get);
router.post('/', middleware, post);

async function get(req, res) {

    let options = await getParticipantEmails();

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

function getParticipantEmails() {
    return Participant.find({verify: true}, 'email').sort({email: 1});
};

module.exports = router;