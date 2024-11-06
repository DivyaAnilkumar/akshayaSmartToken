const mongoose = require('mongoose');

const akshayaCenterSchema = new mongoose.Schema({
    centerName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    // phone: { type: String, required: true },
    // address: { type: String, required: true },
    // passwordHash: { type: String, required: true },
    // legalCertificatePath: { type: String, required: true },  // Encrypted path
    tokenGenerationEnabled: { type: Boolean, default: true }, // Controls token generation
    status: { type: String, enum: ['active', 'deactive', 'blocked'], default: 'active' },
    currentServicingTokenNumber: { type: Number, default: 0 },  // Current token number being serviced
    location: { type: String },
    currentPeopleCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('akshayacenter', akshayaCenterSchema);
