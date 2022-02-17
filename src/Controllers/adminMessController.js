const Joi = require('joi');
const View = require('../Models/view');
const Mess = require('../Models/mess');
const Action = require('../Models/action');
const Owner = require('../Models/owner');
const Menu = require('../Models/menu');
const Comment = require('../Models/comment');
const redis = require('../Database/redis');

const adminMessController = {
    async getAll(req, res, next) {

        // fetching from cache
        const cacheAdminMesses = await redis.get("cacheAdminMesses");
        if (cacheAdminMesses !== null) {
            return res.json(JSON.parse(cacheAdminMesses));
        }

        let messes;

        try {

            messes = await Mess.find().select('-createdAt -__v -non_veg -parcel_service -lunch_time -dinner_time').sort({ _id: -1 });

        } catch (e) {
            return res.json(e);
        }

        // caching all messes data
        await redis.set("cacheAdminMesses", JSON.stringify(messes));
        await redis.expire("cacheAdminMesses", 30);

        res.json(messes)
    },

    async getOne(req, res, next) {

        // fetching from cache
        const cacheAdminMess = await redis.get("cacheAdminMess");
        if (cacheAdminMess !== null) {
            return res.json(JSON.parse(cacheAdminMess));
        }

        let mess_info;
        let _id = req.params.id;

        try {

            const mess = await Mess.findById({ _id }).select('-updatedAt -__v');

            // view, like, dislike code
            const views = await View.find().count();
            const action = await Action.find({ mess_id: _id }).select('-updatedAt -__v');
            const like_count = await Action.find({ mess_id: _id, like: true }).count();
            const dislike_count = await Action.find({ mess_id: _id, dislike: true }).count();
            const comment = await Comment.find({ mess_id: _id }).select('-updatedAt -__v');
            const owner = await Owner.findOne({ mess_id: _id }).select('-updatedAt -__v -createdAt -owner_password')

            mess_info = {
                mess, views, like_count, dislike_count, action, comment, owner
            }

        } catch (e) {
            return res.json(e);
        }

        // caching all messes data
        await redis.set("cacheAdminMess", JSON.stringify(mess_info));
        await redis.expire("cacheAdminMess", 30);

        res.json(mess_info)
    },

    async updateInfo(req, res, next) {
        const validateMess = Joi.object({
            // mess info
            mess_name: Joi.string().max(30).min(3).required(),
            mess_address: Joi.string().max(150).min(10).required(),
            thali_price: Joi.number().required(),
            // owner info
            // owner_name: Joi.string().required(),
            // owner_email: Joi.string().email().required(),
            // owner_phone: Joi.number().required(),
            // owner_password: Joi.string().required(),
            // mess aditional info
            parcel_service: Joi.boolean().required(),
            non_veg: Joi.boolean().required(),
            // is_active: Joi.boolean().required(),
            lunch_time: Joi.string().max(30).min(3).required(),
            dinner_time: Joi.string().max(30).min(3).required()
        })

        const { error } = await validateMess.validate(req.body);

        if (error) {
            return next(error);
        }

        const { mess_name, mess_address, thali_price, is_active, owner_name, owner_email, owner_phone, owner_password, lunch_time, dinner_time, parcel_service, non_veg } = req.body;


        let mess;

        try {
            mess = await Mess.findOneAndUpdate({ _id: req.params.id }, {
                mess_name, thali_price, mess_address, parcel_service, non_veg, dinner_time, lunch_time
            }, { new: true });

        } catch (e) {
            console.log(e);
            return res.json(e);
        }


        // update mess owner

        let owner;

        try {

            owner = await Owner.findOneAndUpdate({ mess_id: req.params.id }, {
                owner_name,
                owner_email,
                owner_password,
                owner_phone,
            }, { new: true })

        } catch (error) {
            return res.json(error);
        }

        res.json({ data: { mess, owner } })
    },

    async updateOwner(req, res, next) {
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

            owner = await Owner.findOneAndUpdate({ _id: req.params.id }, {
                owner_phone, owner_email, owner_name, owner_password
            }, { new: true })

        } catch (e) {
            return res.json(e)
        }

        res.json("owner updated")
    },

    async deleteMess(req, res, next) {

        let data = {};

        try {

            const mess = await Mess.findByIdAndRemove({ _id: req.params.id });
            if (!mess) {
                return res.json({ data: "mess not found" })
            }
            const owner = await Owner.findOneAndRemove({ mess_id: req.params.id });

            const menu = await Menu.findOneAndRemove({ mess_id: req.params.id });

            data = {
                mess, owner, menu
            }

        } catch (error) {
            console.log(error);
        }

        res.json(data)
    },

    async addMess(req, res, next) {

        const validateMess = Joi.object({
            // mess info
            mess_name: Joi.string().max(30).min(3).required(),
            mess_address: Joi.string().max(150).min(10).required(),
            thali_price: Joi.number().required(),
            // owner info
            owner_name: Joi.string().required(),
            owner_email: Joi.string().email().required(),
            owner_phone: Joi.number().required(),
            owner_password: Joi.string().required(),
            // mess aditional info
            mess_poster: Joi.string().uri().required().allow(''),
            parcel_service: Joi.boolean().required(),
            non_veg: Joi.boolean().required(),
            lunch_time: Joi.string().max(30).min(3).required(),
            dinner_time: Joi.string().max(30).min(3).required()
        })

        const { error } = await validateMess.validate(req.body);

        if (error) {
            return next(error);
        }

        const { mess_name, mess_address, thali_price, is_active, owner_name, owner_email, owner_phone, owner_password, mess_poster, lunch_time, dinner_time, parcel_service, non_veg } = req.body;

        const new_mess = Mess({
            mess_name,
            thali_price,
            mess_address,
            mess_poster,
            parcel_service,
            lunch_time,
            dinner_time,
            non_veg,
            is_active
        })

        let mess_id;

        try {
            const result = await new_mess.save();
            mess_id = result._id

        } catch (e) {
            return res.json(e);
        }

        console.log(mess_id);

        // add mess owner
        const owner = Owner({
            owner_name,
            owner_email,
            owner_password,
            owner_phone,
            mess_id
        });

        let owner_id;

        try {

            const result = await owner.save();
            owner_id = result._id;

        } catch (error) {
            return res.json(error);
        }

        let new_menu;

        try {

            const menu = new Menu({
                menu_image: "https://messwala-test8778.s3.us-east-2.amazonaws.com/newmess.jpeg",
                mess_id,
                menu_list: []
            })

            new_menu = await menu.save();
            console.log(new_menu);
        } catch (error) {
            return next(error);
        }

        res.json({ data: mess_id + " " + owner_id + " " + new_menu._id })

    },

    async blockMess(req, res, next) {

        let mess;
        let _id = req.params.id;
        try {

            mess = await Mess.findById({ _id })
            if (!mess) {
                return res.json({ data: "mess not found" });
            }

            mess = await Mess.findOneAndUpdate({ _id }, {
                "is_active": false
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("mess blocked");

    },

    async unblockMess(req, res, next) {

        let mess;
        let _id = req.params.id;
        try {

            mess = await Mess.findById({ _id })
            if (!mess) {
                return res.json({ data: "mess not found" });
            }

            mess = await Mess.findOneAndUpdate({ _id }, {
                "is_active": true
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("mess unblocked");

    }
}

module.exports = adminMessController