const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');
const Match = require('../../models/match');

router.get('/', middleware, function(req, res) {

    getMatches(function(err, docs) {

        if (err) {
            console.log(error);
            return res.redirect('/oops');
        }

        return res.render('matched', {matches: docs});
    });
});

function getMatches(callback) {
    return Match.find({}, callback);
}

module.exports = router;