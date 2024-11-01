const mongoose = require('mongoose');

const AkshayaCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  services: [String],
  approved: { type: Boolean, default: false },
  legalCertificate: { type: String, required: true },
});

module.exports = mongoose.model('akshayacenter', AkshayaCenterSchema);
