const router = require('express').Router();
const {get} = require('./homepage');

router.get('/', get);

module.exports = router;