"use strict";

const router = require('express').Router();
const {get, post} = require('./email');

router.get('/', get);
router.post('/', post);

module.exports = router;