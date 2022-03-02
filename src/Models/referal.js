const mongoose = require('mongoose');
const { Schema } = mongoose;

const referalSchema = new Schema({
    name: { type: String, required: true },
    refer_id: { type: String, required: true, unique: true },
    refer_count: { type: Number, required: false, default: 1 },
    is_active: { type: Boolean, required: false, default: true },
    reward: { type: Boolean, required: false, default: false }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('Referal', referalSchema, 'referals');