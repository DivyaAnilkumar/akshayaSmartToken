const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: { type: String, required: true },  // Action type e.g., 'approve_center', 'block_center'
    details: { type: String },  // Additional information about the action
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
