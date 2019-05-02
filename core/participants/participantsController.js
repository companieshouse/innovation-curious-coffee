const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');

const ParticipantsService = require('./participantsService');

router.get('/', middleware, get);

async function get(req, res) {

    var participantsService = new ParticipantsService();

    let participants = await participantsService.getParticipants();
    
    return res.render('participants', {
        participants: participants 
     });
};

module.exports = router;