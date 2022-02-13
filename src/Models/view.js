const mongoose = require('mongoose');
const { Schema } = mongoose;

const actionSchema = new Schema({
    mess_id: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    name: { type: String, required: true }
})

module.exports = mongoose.model('View', actionSchema, 'views');