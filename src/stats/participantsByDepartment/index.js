"use strict";

const router = require('express').Router();
const {get, getData} = require('./participantsByDepartment');

router.get('/', get);
router.get('/data', getData);

module.exports = router;