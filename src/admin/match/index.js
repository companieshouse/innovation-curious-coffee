"use strict";

const router = require('express').Router();
const {get, post} = require('./match');

router.get('/', get);
router.post('/', post);

module.exports = router;