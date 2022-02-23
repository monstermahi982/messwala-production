const Joi = require('joi');
const Owner = require('../Models/owner');
const JwtService = require('../Services/JwtService');
const mongoose = require('mongoose');

const ownerController = {

    async updateOwner(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        const ownerUpdateSchema = Joi.object({
            owner_name: Joi.string().max(30).min(3).required(),
            owner_email: Joi.string().email().required(),
            owner_phone: Joi.number().required(),
            owner_password: Joi.string().required(),
        })

        const { error } = await ownerUpdateSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { owner_phone, owner_email, owner_name, owner_password } = req.body;

        let owner;

        try {

            owner = await Owner.findOneAndUpdate({ mess_id: req.params.id }, {
                owner_phone, owner_email, owner_name, owner_password
            }, { new: true })

        } catch (e) {
            return next(e);
        }

        res.json(owner)
    },

    async login(req, res, next) {

        const loginSchema = Joi.object({
            owner_phone: Joi.number().required(),
            owner_password: Joi.string().required()
        })

        const { error } = await loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { owner_phone, owner_password } = req.body;

        let token;

        try {

            // checking user in db
            const exist = await Owner.exists({ owner_phone });
            if (!exist) {
                return res.json("not found");
            }

            const owner = await Owner.findOne({ owner_phone });
            if (owner.owner_password !== owner_password) {
                return res.json("wrong password")
            }

            token = JwtService.sign({ name: owner.owner_name, id: owner._id, email: owner.owner_email, mess_id: owner.mess_id, owner_status: true })

        } catch (e) {
            return next(e);
        }

        res.json(token)
    }

}

module.exports = ownerController