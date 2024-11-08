const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String }, // Required for users
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'deactive'], default: 'active' },
    failedAttempts: { type: Number, default: 0 }, // For tracking login attempts
    lastLogin: { type: Date, default: Date.now },
    role: { type: String, enum: ['admin', 'user', 'akshayaCenter'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    // services: { type: [String] }, // Only required for akshayaCenter
    // legalCertificates: { type: String }, // Only required for akshayaCenter
    // isApproved: { type: Boolean, default: false } // Approval status for akshayaCenter
},{
    timestamps : true,
});

module.exports = mongoose.model('user', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     phone: { type: String, required: true },
//     passwordHash: { type: String, required: true }, // Store hashed password
//     status: { type: String, enum: ['active', 'deactive'], default: 'active' },
//     failedAttempts: { type: Number, default: 0 }, // For tracking login attempts
//     lastLogin: { type: Date, default: Date.now },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('user', userSchema);
