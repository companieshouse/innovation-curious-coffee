const router = require('express').Router();
const {get} = require('./participants');

router.get('/', get);

module.exports = router;