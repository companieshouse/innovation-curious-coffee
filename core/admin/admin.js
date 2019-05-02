const express = require('express');
const router = express.Router();
const config = require('../../config/config');

router.get('/', function(req, res, next) {
    res.render('admin');
});

router.post('/', function(req, res, next) {

    if (req.body.password == config.admin.password) {
        res.locals.session.user = true;
        res.redirect('/');
    } else {
        res.render('admin', {
                password: req.body.password,
                password_error: "Incorrect password."
        });
    }
});

module.exports = router;