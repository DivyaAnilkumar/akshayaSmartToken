const mongoose = require('mongoose');


const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'AkshayaCenter', required: true },
    // serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    tokenNumber: { type: Number, required: true },
    // tokenTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('token', tokenSchema);
