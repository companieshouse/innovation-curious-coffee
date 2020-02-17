"use strict";

const router = require('express').Router();
const {get} = require('./error');

router.get('/', get);

module.exports = router;