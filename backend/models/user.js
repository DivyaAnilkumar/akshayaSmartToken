const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true }, // Store hashed password
    status: { type: String, enum: ['active', 'deactive'], default: 'active' },
    failedAttempts: { type: Number, default: 0 }, // For tracking login attempts
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', userSchema);
