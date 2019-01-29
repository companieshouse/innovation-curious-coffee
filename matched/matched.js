const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');

const dbname = 'matches';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

router.get('/', middleware, function(req, res) {

    db.matches.find(function(err, docs) {

        res.render('matched', {matches: docs});
    });
});

module.exports = router;