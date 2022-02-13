const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({

    // menu info
    dish_name: { type: String, required: true },

})


module.exports = mongoose.model('Item', itemSchema, 'items');