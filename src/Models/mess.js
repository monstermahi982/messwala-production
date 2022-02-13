const mongoose = require('mongoose');
const { Schema } = mongoose;

const messSchema = new Schema({

    // mess info
    mess_name: { type: String, required: true },
    thali_price: { type: Number, required: true },
    mess_address: { type: String, required: true },
    mess_poster: { type: String, required: true },

    // other services
    parcel_service: { type: Boolean, required: false, default: false },
    lunch_time: { type: String, required: true },
    dinner_time: { type: String, required: true },
    non_veg: { type: Boolean, required: false, default: false },
    is_active: { type: Boolean, required: false, default: false }

}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('MessDate', messSchema, 'mess');