const mongoose = require('mongoose');
const { Schema } = mongoose;

const referalOfferSchema = new Schema({
    mess_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, required: false, default: 0 },
    views: { type: Number, required: false, default: 0 },
    is_active: { type: Boolean, required: false, default: false },
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('ReferalOffer', referalOfferSchema, 'referaloffers');