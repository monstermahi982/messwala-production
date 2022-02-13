const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    mess_id: { type: String, required: true }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('Comment', commentSchema, 'comments');