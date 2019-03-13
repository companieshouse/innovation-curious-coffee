const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

router.get('/', middleware, function(req, res) {

    db.matches.find(function(err, docs) {

        if (err) {
            res.redirect('/error');
        }

        res.render('matched', {matches: docs});
    });
});

module.exports = router;