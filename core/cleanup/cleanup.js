const express = require('express');
const router = express.Router();
const middleware = require('../../core/middleware/middleware');
const Match = require('../../models/match');

router.get('/', middleware, get);
router.post('/', middleware, post);

function get(req, res) {
    return res.render('cleanup');
};

function post(req, res) {
    Match.deleteMany({}, function(err) {
        if (err) {
            console.error(error);
            return err;
        }
    });

    res.redirect('/');
};

module.exports = router;