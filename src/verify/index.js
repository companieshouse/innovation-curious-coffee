"use strict";

const router = require('express').Router();
const {get} = require('./verify');

router.get('/', get);

module.exports = router;