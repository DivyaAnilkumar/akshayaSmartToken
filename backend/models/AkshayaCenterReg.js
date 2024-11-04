const mongoose = require('mongoose');

const centerRegistrationSchema = new mongoose.Schema({
    centerName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    passwordHash: { type: String, required: true },  // Hashed password
    servicesOffered: { type: String },
    legalCertificatePath: { type: String, required: true },  // Encrypted certificate path
    certificateStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    registrationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }  // Admin who approves/rejects
});

module.exports = mongoose.model('CenterRegistration', centerRegistrationSchema);
