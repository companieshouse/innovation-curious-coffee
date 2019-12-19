const router = require('express').Router();
const {get} = require('./faq');

router.get('/', get);

module.exports = router;