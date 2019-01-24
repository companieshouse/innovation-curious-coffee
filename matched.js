const express = require('express');
const router = express.Router();

const dbname = 'matches';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

router.get('/', function(req, res) {

    db.matches.find(function(err, docs) {

        res.render('matched', {matches: docs});
    });
});

module.exports = router;