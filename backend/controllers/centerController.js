// // controllers/centerController.js
// const AkshayaCenter = require('../models/AkshayaCenter');

// // Approve Center
// exports.approveCenter = async (req, res) => {
//   try {
//     const center = await AkshayaCenter.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
//     if (!center) return res.status(404).json({ message: 'Center not found' });
//     res.json({ message: 'Center approved', center });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Reject Center
// exports.rejectCenter = async (req, res) => {
//   try {
//     const center = await AkshayaCenter.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
//     if (!center) return res.status(404).json({ message: 'Center not found' });
//     res.json({ message: 'Center rejected', center });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
