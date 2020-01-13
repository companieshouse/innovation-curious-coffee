const router = require('express').Router();
const {get} = require('./matched');

router.get('/', get);

module.exports = router;