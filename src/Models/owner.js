const mongoose = require('mongoose');
const { Schema } = mongoose;

const ownerSchema = new Schema({
    // owern info
    owner_email: { type: String, required: true, unique: true },
    owner_phone: { type: Number, required: true, },
    owner_name: { type: String, required: true },
    owner_password: { type: String, required: true },
    mess_id: { type: String, required: true }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('Owner', ownerSchema, 'owners');