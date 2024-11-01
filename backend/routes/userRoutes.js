const express = require('express');
const AkshayaCenter = require('../model/AkshayaCenter');
const router = express.Router();


router.get('/search', async (req, res) => {
  try {
    const centers = await AkshayaCenter.find({ approved: true });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:id/generateToken', async (req, res) => {
  try {
    const center = await AkshayaCenter.findById(req.params.id);
    if (!center || !center.approved) return res.status(404).json({ message: 'Center not found or not approved' });

    const tokenNumber = `TOKEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    res.json({ message: `Token generated for ${center.name}`, token: tokenNumber });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
