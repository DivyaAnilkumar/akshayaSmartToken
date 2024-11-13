// routes/adminRoutes.js
const express = require('express');
const {getCenter, approveCenter, rejectCenter, blockCenter, unblockCenter } = require('../controllers/adminController');
const router = express.Router();

router.get('/centers', getCenter);
// Approve Akshaya Center
router.patch('/approve/:id', approveCenter);

// Reject Akshaya Center
router.patch('/reject/:id', rejectCenter);

// Block Akshaya Center
router.patch('/block/:id', blockCenter);

// Unblock Akshaya Center
router.patch('/unblock/:id', unblockCenter);

module.exports = router;
