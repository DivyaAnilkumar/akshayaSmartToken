
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { 
        type: String, 
        enum: ['user', 'admin', 'akshaya_center'], 
        required: true 
    }
});


const User = mongoose.model('user', userSchema);


module.exports = User;
