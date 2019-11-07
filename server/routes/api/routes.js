const express = require('express');
const router = express.Router();

const auth = require('./authentication');
const profile = require('./profile');
router.use('/auth', auth);
router.use('/profile', profile);

module.exports = router;
