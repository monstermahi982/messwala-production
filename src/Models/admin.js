const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    super_user: { type: Boolean, required: false, default: false }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('Admin', adminSchema, 'admins');