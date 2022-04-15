const mongoose = require('mongoose');
const { Schema } = mongoose;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const messSchema = new Schema({

    // mess info
    mess_name: { type: String, required: true },
    slug: { type: String, slug: "mess_name", slug_padding_size: 1, unique: true },
    thali_price: { type: Number, required: true },
    mess_address: { type: String, required: true },
    mess_poster: { type: String, required: true },

    // other services
    parcel_service: { type: Boolean, required: false, default: false },
    lunch_time: { type: String, required: true },
    dinner_time: { type: String, required: true },
    non_veg: { type: Boolean, required: false, default: false },
    google_location: { type: String, required: false, default: "18.4602393,73.8345744" },
    is_active: { type: Boolean, required: false, default: false }

}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('MessDate', messSchema, 'mess');