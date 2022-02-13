const Joi = require('joi');
const Item = require('../Models/item');
const mongoose = require('mongoose');

const itemController = {
    async get(req, res, next) {

        let items = [];
        try {

            items = await Item.find().select('-updatedAt -__v').sort({ _id: -1 });

            if (!items) {
                return res.json({ data: "id not found" })
            }

        } catch (e) {
            return res.json(e);
        }

        res.json(items)
    },

    async add(req, res, next) {

        const itemSchema = Joi.object({
            dish_name: Joi.string().required(),
        })

        const { error } = await itemSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { dish_name } = req.body;

        const item = new Item({
            dish_name
        })

        let id;
        let result
        try {
            result = await item.save();
            id = result._id;
        } catch (e) {
            return res.json(e)
        }

        res.json("new item added")
    },

    async delete(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        let item;
        try {
            item = await Item.findOneAndRemove({ _id: req.params.id });

            if (!item) {
                return res.json({ data: "not to delete" })
            }

        } catch (err) {
            return next(err);
        }

        res.json("item deleted");
    },

}

module.exports = itemController;