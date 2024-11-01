
const mongoose = require('mongoose');


const akshayaCenterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    services: { type: String, required: true }, 
    contact_number: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        required: true 
    },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


const AkshayaCenter = mongoose.model('AkshayaCenter', akshayaCenterSchema);


module.exports = AkshayaCenter;
