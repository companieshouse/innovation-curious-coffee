const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');

const dbname = 'people';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

router.get('/', middleware, function(req, res) {

    db.people.find().sort({department:1}, function(err, docs) {
        res.render('participants', {participants: docs});
    });
});

module.exports = router;