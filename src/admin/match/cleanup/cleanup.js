"use strict";

const Match = require('../../../models/match');

function get(req, res) {
    return res.render('cleanup');
}

function post(req, res) {
    Match.deleteMany({}, function(err) {
        if (err) {
            console.error(err);
            return err;
        }
    });

    res.redirect('/');
}

module.exports.get = get;
module.exports.post = post;