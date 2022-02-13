const Mess = require('../Models/mess');
const Action = require('../Models/action');
const Joi = require('joi');
const mongoose = require('mongoose');

const actionConroller = {

    async getActions(req, res, next) {

        let actions = [];
        try {
            actions = await Action.find().select('-updatedAt -__v').sort({ _id: -1 });
        } catch (error) {
            return next(error);
        }

        res.json(actions);
    },

    async deleteAction(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        let action;
        try {
            action = await Action.findOneAndRemove({ _id: req.params.id });
            if (!action) {
                return res.json({ data: "not found" })
            }
        } catch (error) {
            return next(error);
        }

        res.json("action deleted");
    },

    async actionLike(req, res, next) {

        const actionSchema = Joi.object({
            mess_id: Joi.string().max(30).min(3).required()
        })

        const { error } = await actionSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { mess_id } = req.body;
        const { name, email } = req.user;

        try {

            const MessExist = await Mess.exists({ _id: mess_id })
            if (!MessExist) {
                return res.json("mess not found");
            }

            const exist = await Action.findOne({ email, mess_id });
            if (exist) {
                return res.json({ data: "action is already exists" })
            }
        } catch (e) {
            return error(e);
        }

        const action = new Action({
            mess_id,
            email,
            name,
            like: true
        })

        let id;

        try {
            const result = await action.save();
            id = result._id;
        } catch (e) {
            return next(e)
        }

        res.json(id)
    },

    async actionDislike(req, res, next) {
        const actionSchema = Joi.object({
            mess_id: Joi.string().max(30).min(3).required()
        })

        const { error } = await actionSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { mess_id } = req.body;
        const { name, email } = req.user;

        try {

            const MessExist = await Mess.exists({ _id: mess_id })
            if (!MessExist) {
                return res.json("mess not found");
            }

            const exist = await Action.exists({ email, mess_id })
            if (exist) {
                return res.json({ data: "email is already exists" })
            }
        } catch (e) {
            return next(e);
        }

        const action = new Action({
            mess_id,
            email,
            name,
            dislike: true
        })

        let id;

        try {
            const result = await action.save();
            id = result._id;
        } catch (e) {
            return next(e)
        }

        res.json(id)
    },

}

module.exports = actionConroller;