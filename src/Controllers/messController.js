const Joi = require('joi');
const Comment = require('../Models/comment');
const View = require('../Models/view');
const Mess = require('../Models/mess');
const User = require('../Models/user');
const Action = require('../Models/action');
const Owner = require('../Models/owner');
const Menu = require('../Models/menu');
const redis = require('../Database/redis');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
// import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET } from '../Configs'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_BUCKET_KEY,
    secretAccessKey: process.env.AWS_SECRET_BUCKET_KEY
})

const messController = {
    async getAllMess(req, res, next) {

        // fetching from cache
        const cachemesses = await redis.get("allmenus");
        if (cachemesses !== null) {
            return res.json(JSON.parse(cachemesses));
        }

        // fetching data from database
        // def variable
        let messes;
        let allmess = []
        let views = 0;
        let like_count = 0;
        let menu_list = [];

        try {

            messes = await Mess.find({ is_active: true }).select('-updatedAt -__v').sort({ _id: -1 });

            for (let i = 0; i < messes.length; i++) {

                // array destructring
                const { _id, mess_name, slug, thali_price, mess_address, mess_poster } = messes[i];

                // view, like, dislike code
                views = await View.find({ mess_id: _id }).count();
                like_count = await Action.find({ mess_id: _id, like: true }).count();


                const menu = await Menu.findOne({ mess_id: _id })
                // remove list before adding new 
                menu_list = []
                if (menu) {
                    menu_list = menu.menu_list;
                    menu_list = menu_list.slice(0, 3)
                }


                // creating object
                const temp_data = {
                    _id,
                    mess_name,
                    slug,
                    mess_address,
                    thali_price,
                    mess_poster,
                    views,
                    like_count,
                    menu_list
                };

                // adding data in array
                allmess.push(temp_data)
            }

        } catch (e) {
            return res.json(e);
        }

        // caching all messes data
        await redis.set("allmenus", JSON.stringify(allmess));
        await redis.expire("allmenus", 30);

        res.json(allmess)
    },

    async getMessMenu(req, res, next) {


        // counting user view
        const { email, name } = req.user;
        try {

            const mess_result = await Mess.findOne({ slug: req.params.id }).select('-updatedAt -__v');

            if (mess_result !== null) {

                const exist = await View.exists({ email: email, mess_id: mess_result._id })

                if (!exist) {

                    const view = new View({
                        "mess_id": mess_result._id,
                        email,
                        name
                    })
                    const result = await view.save();
                }

            }


        } catch (e) {
            return next(e);
        }

        // using cached data
        const cachemess = await redis.get(req.params.id);
        if (cachemess !== null) {
            return res.json(JSON.parse(cachemess));
        }

        // fetching data from database
        let menu;

        try {

            // menu = await Mess.findOne({ $or: [{ slug: req.params.id }, { _id: req.params.id }] }).select('-updatedAt -__v').sort({ _id: -1 });
            menu = await Mess.findOne({ slug: req.params.id }).select('-updatedAt -__v');
            if (!menu) {
                return res.json({ data: "id not found" })
            }

        } catch (e) {
            return res.json(e);
        }

        const { _id, mess_name, mess_address, thali_price, mess_poster, lunch_time, dinner_time, parcel_service, non_veg } = menu;

        // counting like and dislike

        let like_count = 0;
        let dislike_count = 0;

        try {

            like_count = await Action.find({ mess_id: _id, like: true }).count();
            dislike_count = await Action.find({ mess_id: _id, dislike: true }).count();

        } catch (error) {
            return res.json(error)
        }

        // comment code 

        let comment = [];

        try {

            comment = await Comment.find({ mess_id: _id }).select('-updatedAt -__v -mess_id').sort({ _id: -1 });

        } catch (error) {
            return res.json(error)
        }

        let menu_image;

        try {

            const menu = await Menu.findOne({ mess_id: _id })
            if (menu) {
                menu_image = menu.menu_image;
            }

        } catch (error) {
            console.log(error);
        }

        try {
            owner_info = await Owner.findOne({ "mess_id": _id }).select('-updatedAt -__v -createdAt -mess_id -owner_email -_id -owner_password');
        } catch (error) {
            return next(error);
        }

        let menu_data = await {
            _id,
            mess_name,
            thali_price,
            mess_address,
            lunch_time,
            dinner_time,
            parcel_service,
            non_veg,
            like_count,
            dislike_count,
            comment,
            menu_image,
            owner_info
        }


        // caching all mess data
        await redis.set(req.params.id, JSON.stringify(menu_data));
        await redis.expire(req.params.id, 30);

        res.json(menu_data)
    },

    async messDeatils(req, res, next) {
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        // using cached data
        const cachemess = await redis.get(req.params.id);
        if (cachemess !== null) {
            return res.json(JSON.parse(cachemess));
        }

        // fetching data from database
        let menu;

        try {

            menu = await Mess.findById({ _id: req.params.id }).select('-updatedAt -__v').sort({ _id: -1 });

            if (!menu) {
                return res.json({ data: "id not found" })
            }

        } catch (e) {
            return res.json(e);
        }

        const { _id, mess_name, mess_address, thali_price, mess_poster, lunch_time, dinner_time, parcel_service, non_veg } = menu;

        let owner_info;

        try {

            owner_info = await Owner.findOne({ "mess_id": req.params.id }).select('-updatedAt -__v -owner_password');

        } catch (error) {
            return next(error);
        }

        const { owner_email, owner_phone, owner_name } = owner_info;

        let menu_data = await {
            _id,
            mess_name,
            thali_price,
            mess_address,
            lunch_time,
            dinner_time,
            parcel_service,
            non_veg,
            mess_poster,
            owner_email,
            owner_name,
            owner_phone

        }


        // caching all mess data
        await redis.set(req.params.id, JSON.stringify(menu_data));
        await redis.expire(req.params.id, 30);

        res.json(menu_data)
    },

    async updateInfo(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        const infoSchema = Joi.object({
            mess_name: Joi.string().max(30).min(3).required(),
            thali_price: Joi.number().required(),
            mess_address: Joi.string().max(150).min(10).required(),
            parcel_service: Joi.boolean().required(),
            non_veg: Joi.boolean().required(),
            lunch_time: Joi.string().max(30).min(3).required(),
            dinner_time: Joi.string().max(30).min(3).required()
        })

        const { error } = await infoSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { mess_name, thali_price, mess_address, parcel_service, non_veg, dinner_time, lunch_time } = req.body;

        let result;

        try {

            result = await Mess.findOneAndUpdate({ _id: req.params.id }, {
                mess_name, thali_price, mess_address, parcel_service, non_veg, dinner_time, lunch_time
            }, { new: true });

        } catch (e) {
            return res.json(e)
        }

        res.json("info updated");
    },

    async updatePoster(req, res, next) {

        let mess_poster;

        if (req.file === undefined) {
            return res.json("no file selected");
        }

        // checking file size
        if (req.file.size > 10000000) {
            return res.json("max limit exists");
        }

        // getting file extension
        const fileExtension = req.file.originalname.split('.')[1]

        const params = {
            Bucket: `${process.env.AWS_BUCKET_NAME}/posters`,
            Key: `${uuid()}.${fileExtension}`,
            Body: req.file.buffer,
            ContentType: "image/jpeg"
        };

        // uploading image to aws s3
        s3.upload(params, async function (err, data) {
            if (err) {
                console.log("Error", err);
                return next(err);
            }

            if (data) {
                console.log("Uploaded in:", data.Location);
                mess_poster = data.Location;

                const updateData = await Mess.findByIdAndUpdate({ _id: req.body.id }, {
                    mess_poster
                }, { new: true });

                res.json(updateData);
            } else {
                res.json({ data: "someting went wrong" });
            }
        })
    },

    async ownerStatics(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        let like;
        let dislike;
        let view;
        let comment;
        let data;
        const _id = req.params.id;

        try {

            view = await View.find({ mess_id: _id }).count();
            like = await Action.find({ mess_id: _id, like: true }).count();
            dislike = await Action.find({ mess_id: _id, dislike: true }).count();
            comment = await Comment.find({ mess_id: _id }).count();
        } catch (error) {
            return next(error);
        }

        data = {
            like, dislike, view, comment
        }

        res.json(data)
    }
}

module.exports = messController;
// export default messController;