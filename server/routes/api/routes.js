const express = require('express');
const router = express.Router();

const auth = require('./authentication');
router.use('/auth', auth);

module.exports = router;
