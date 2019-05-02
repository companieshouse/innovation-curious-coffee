const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');

const ParticipantsService = require('./participantsService');

router.get('/', middleware, function(req, res) {

    var participantsService = new ParticipantsService();

    participantsService.getParticipants(function(err, participants) {
        if (err) {
            console.error(err);
            return res.redirect('/oops');
        }

        res.render('participants', {
           participants: participants 
        });
    });
});

module.exports = router;