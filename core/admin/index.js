const router = require('express').Router();
const admin = require('./admin');

router.get('/', admin.get);
router.post('/', admin.post);

module.exports = router;