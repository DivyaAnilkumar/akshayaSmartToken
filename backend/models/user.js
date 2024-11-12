const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String }, // Required for users
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ['active', 'deactive'], default: 'active' },
    failedAttempts: { type: Number, default: 0 }, 
    lastLogin: { type: Date, default: Date.now },
    role: { type: String, enum: ['admin', 'user', 'akshayaCenter'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    // services: { type: [String] }, 
    // legalCertificates: { type: String }, 
    // isApproved: { type: Boolean, default: false } 
},{
    timestamps : true,
});

module.exports = mongoose.model('user', userSchema);
