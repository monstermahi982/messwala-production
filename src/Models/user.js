const mongoose = require('mongoose');
const { Schema } = mongoose;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false, default: '' },
    refer_id: { type: String, slug: "name", slug_padding_size: 4, unique: true },
    is_active: { type: Boolean, required: false, default: true }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('User', userSchema, 'users');