const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const Match = require('../models/match');

const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

router.get('/', middleware, function(req, res) {

    getMatches(function(err, docs) {

        if (err) {
            console.log(error);
            return err;
        }

        return res.render('matched', {matches: docs});
    });
});

function getMatches(callback) {
    return Match.find({}, callback);
}

module.exports = router;