// backend/routes/tokenRoutes.js
const express = require('express');
const { sendTokenSMS } = require('../controllers/tokenController');

const router = express.Router();

router.post('/send-token-sms', sendTokenSMS);

module.exports = router;
