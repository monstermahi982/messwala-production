const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuSchema = new Schema({

    // menu info
    menu_image: { type: String, required: false, default: "" },
    mess_id: { type: String, required: true },
    menu_list: [
        {
            _id: { type: String, required: true },
            dish_name: { type: String, required: true }
        }

    ]

}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })


module.exports = mongoose.model('Menu', menuSchema, 'menus');