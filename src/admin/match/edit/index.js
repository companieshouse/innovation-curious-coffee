const router = require('express').Router();
const {get, post, getData} = require('./edit');

router.get('/:id', get);
router.post('/:id', post);
router.get('/data/:email', getData)

module.exports = router;