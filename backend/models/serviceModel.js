const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'AkshayaCenter', required: true },
    serviceName: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('service', serviceSchema);
