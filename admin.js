const express = require('express');
const router = express.Router();

var fs = require('fs');

var adminJSON = JSON.parse(fs.readFileSync('admin.json', 'utf8'));

router.get('/', function(req, res, next) {
    res.render('admin');
});

router.post('/', function(req, res, next) {

    if (req.body.password == adminJSON.password) {
        var app = req.app;
        app.locals.user = true;
        res.redirect('/');
    } else {
        res.render('admin', {
                password: req.body.password,
                password_error: "Incorrect password."
        });
    }
});

module.exports = router;