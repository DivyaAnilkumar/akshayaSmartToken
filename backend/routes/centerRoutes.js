const express = require('express');
const AkshayaCenter = require('../model/AkshayaCenter');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, services, legalCertificate } = req.body;
  try {
    const center = new AkshayaCenter({ name, services, legalCertificate });
    await center.save();
    res.status(201).json(center);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id/approve', async (req, res) => {
  try {
    const center = await AkshayaCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });

    center.approved = true;
    await center.save();
    res.json({ message: 'Center approved', center });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
