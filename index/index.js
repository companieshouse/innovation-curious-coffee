const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {messages: req.flash('info')});
});

module.exports = router;