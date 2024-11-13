// controllers/adminController.js
const AkshayaCenter = require('../models/AkshayaCenter');


exports.getCenter = async (req, res) => {
    try {
      const centers = await AkshayaCenter.find(); // Fetch all centers from the database
      res.json(centers);
    } catch (error) {
      console.error('Error fetching centers:', error);
      res.status(500).json({ message: 'Server error while fetching centers.' });
    }
  };

// Approve Akshaya Center
exports.approveCenter = async (req, res) => {
  try {
    const center = await AkshayaCenter.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center approved successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Error approving center', error });
  }
};

// Reject Akshaya Center
exports.rejectCenter = async (req, res) => {
    try {
      console.log(`Rejecting center with ID: ${req.params.id}`);
      const center = await AkshayaCenter.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { new: true }
      );
      if (!center) {
        console.log('Center not found');
        return res.status(404).json({ message: 'Center not found' });
      }
      res.json({ message: 'Center rejected successfully', center });
    } catch (error) {
      console.error('Error rejecting center:', error);
      res.status(500).json({ message: 'Error rejecting center', error });
    }
  };
  

// Block Akshaya Center
exports.blockCenter = async (req, res) => {
  try {
    const center = await AkshayaCenter.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center blocked successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking center', error });
  }
};

// Unblock Akshaya Center
exports.unblockCenter = async (req, res) => {
  try {
    const center = await AkshayaCenter.findByIdAndUpdate(req.params.id, { blocked: false }, { new: true });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center unblocked successfully', center });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking center', error });
  }
};
