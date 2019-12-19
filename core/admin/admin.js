const express = require('express');
const router = express.Router();
const config = require('../../config');

router.get('/', get);

router.post('/', post);

function get(req, res) {
    return res.render('admin');
};

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
};

module.exports = router;