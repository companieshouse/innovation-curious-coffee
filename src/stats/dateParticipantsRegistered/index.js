const router = require('express').Router();
const {get, getData} = require('./dateParticipantsRegistered');
const middleware = require('../../../core/middleware/middleware');

router.get('/', middleware, get);
router.get('/data', middleware, getData);

module.exports = router;