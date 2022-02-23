const Joi = require('joi');
const Menu = require('../Models/menu');
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
// import { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET } from '../Configs'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_BUCKET_KEY,
    secretAccessKey: process.env.AWS_SECRET_BUCKET_KEY
})

const adminMenuController = {

    async uploadMenu(req, res, next) {

        const menuSchema = Joi.object({
            menu_image: Joi.string().uri().required(),
            mess_id: Joi.string().required(),
            menu_list: Joi.array().items(
                Joi.object({
                    _id: Joi.string().required(),
                    dish_name: Joi.string().required(),
                }))
        })

        const { error } = await menuSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { menu_image, mess_id, menu_list } = req.body;

        let result;

        try {

            const exist = await Menu.exists({ mess_id })
            if (!exist) {
                return res.json({ data: "no record found" });
            }

            result = await Menu.findOneAndUpdate({ mess_id }, {
                menu_image, menu_list
            }, { new: true });

        } catch (e) {
            return next(e)
        }

        res.json(result)
    },

    async uploadImage(req, res, next) {
        let menu_image;

        if (req.file === undefined) {
            return res.json("no file selected");
        }

        // checking file size
        if (req.file.size > 10000000) {
            return res.json("max limit exists");
        }

        // getting file extension
        const fileExtension = req.file.originalname.split('.')[1]

        // params for image
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}.${fileExtension}`,
            Body: req.file.buffer,
            ContentType: "image/jpeg"
        };

        // uploading image to aws s3
        s3.upload(params, async function (err, data) {
            if (err) {
                return next(err);
            }

            if (data) {
                console.log("Uploaded in:", data.Location);
                menu_image = data.Location;
                res.json(menu_image)
            } else {
                res.json({ data: "someting went wrong" });
            }
        })
    },

    async getMenu(req, res, next) {

        let menus = [];
        try {

            menus = await Menu.find().select('-updatedAt -__v').sort({ _id: -1 });

            if (!menus) {
                return res.json("no record found");
            }

        } catch (e) {
            return next(e);
        }

        res.json(menus)
    },

    async deleteMenu(req, res, next) {
        let menu;
        try {

            // checking object id valid or not
            const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
            if (!isValid) {
                return res.json({ data: "id is not valid" })
            }

            menu = await Menu.findOneAndRemove({ _id: req.params.id });

            if (!menu) {
                return res.json({ data: "not to delete" })
            }

        } catch (err) {
            return next(err);
        }

        res.json(menu);
    },

}

module.exports = adminMenuController;