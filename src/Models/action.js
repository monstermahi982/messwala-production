const mongoose = require('mongoose');
const { Schema } = mongoose;

const actionSchema = new Schema({
    mess_id: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    name: { type: String, required: true },
    like: { type: Boolean, default: false },
    dislike: { type: Boolean, default: false }
})

module.exports = mongoose.model('Action', actionSchema, 'actions');