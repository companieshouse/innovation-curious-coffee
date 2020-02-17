"use strict";

const router = require('express').Router();
const {get, post} = require('./register');

router.get('/', get);
router.post('/', post);

module.exports = router;