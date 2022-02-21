const Joi = require('joi');
const Admin = require('../Models/admin');
const redis = require('../Database/redis')
const JwtService = require('../Services/JwtService');

const adminController = {

    async addAdmin(req, res, next) {

        const adminSchema = Joi.object({
            name: Joi.string().max(30).min(3).required(),
            email: Joi.string().email().required(),
            phone: Joi.number().required(),
            password: Joi.string().required()
        })

        const { error } = await adminSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { name, email, phone, password } = req.body;

        let admin = new Admin({
            name, email, phone, password
        })


        try {

            admin = await admin.save();
            if (!admin) {
                return res.status(401).json("something went wrong")
            }

        } catch (error) {
            return next(error);
        }

        res.json("new admin added")
    },

    async getAdmin(req, res, next) {

        let admins;

        try {

            admins = await Admin.find().select('-updatedAt -__v -super_user -password -createdAt').sort({ _id: -1 }).sort();

        } catch (error) {
            return next(error);
        }

        res.json(admins)
    },

    async deleteAdmin(req, res, next) {

        let admin;

        try {

            admin = await Admin.findByIdAndRemove({ _id: req.params.id });

        } catch (error) {
            return next(error);
        }
        res.json("admin added");
    },

    async loginAdmin(req, res, next) {

        const adminSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })

        const { error } = await adminSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let token;

        const { email, password } = req.body;

        try {

            const admin = await Admin.findOne({ email: email })
            if (!admin) {
                return res.json("email not found")
            }

            if (admin.password !== password) {
                return res.json("wrong password")
            }

            token = await JwtService.sign({ email: admin.email, name: admin.name, super_user: admin.super_user, admin: true })

        } catch (error) {
            return next(error);
        }

        res.json(token)
    },

}

module.exports = adminController;