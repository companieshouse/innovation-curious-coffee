"use strict";

const config = require('../config');

function get(req, res) {
    return res.render('admin');
}

function post(req, res) {
    if (req.body.password == config.admin.password) {
        res.locals.session.user = true;
        return res.redirect('/');
    } else {
        return res.render('admin', {
                password: req.body.password,
                password_error: "Incorrect password."
        });
    }
}

module.exports.get = get;
module.exports.post = post;