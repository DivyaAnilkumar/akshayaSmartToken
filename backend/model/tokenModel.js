
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    center_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AkshayaCenter', required: true },
    token_number: { type: String, required: true },
    generation_time: { type: Date, default: Date.now },
    scheduled_time: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['active', 'completed', 'cancelled'], 
        required: true 
    }
});


const Token = mongoose.model('Token', tokenSchema);


module.exports = Token;
