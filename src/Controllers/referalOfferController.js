const Joi = require('joi');
const User = require('../Models/user');
const Mess = require('../Models/mess');
const ReferalOffer = require('../Models/referaloffer');
const redis = require('../Database/redis');
const JwtService = require('../Services/JwtService');

const referalOfferController = {


    async getReferalOffer(req, res, next) {

        let refer_offers = {};
        try {
            const offer_data = await ReferalOffer.findOne({ is_active: true }).select('-updatedAt -__v -is_active');

            if (!offer_data) {
                return next("not found");
            }

            const mess = await Mess.findById({ _id: offer_data.mess_id }).select('mess_name mess_address thali_price mess_poster');

            refer_offers = {
                mess, offer_data
            }

        } catch (error) {
            return next(error);
        }

        res.json(refer_offers);
    },

    async getAllReferalOffer(req, res, next) {

        let refer_offers = [];
        try {
            const offer_data = await ReferalOffer.find().select('-updatedAt -__v');

            for (let i = 0; i < offer_data.length; i++) {

                const { mess_id, description, title, likes, views, _id, createdAt, is_active } = offer_data[i];

                const mess = await Mess.findById({ _id: mess_id }).select('mess_name mess_address thali_price mess_poster');

                const single_data = {
                    mess, description, title, views, likes, createdAt, is_active, _id
                }

                refer_offers.push(single_data);
            }

        } catch (error) {
            return next(error);
        }

        res.json(refer_offers);
    },

    async deleteReferalOffer(req, res, next) {
        let refer_offer;
        try {

            const exist = await ReferalOffer.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("offer not exists");
            }

            refer_offer = await ReferalOffer.findOneAndRemove({ _id: req.params.id });

        } catch (err) {
            return next(err);
        }

        res.json("offer deleted");
    },

    async addReferalOffer(req, res, next) {

        const referalOfferSchema = Joi.object({
            title: Joi.string().max(50).min(3).required(),
            mess_id: Joi.string().required(),
            description: Joi.string().required()
        })

        const { error } = await referalOfferSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let refer_offer;

        const { title, mess_id, description } = req.body;

        try {

            const new_offer = ReferalOffer({
                title, mess_id, description
            })

            refer_offer = await new_offer.save();

        } catch (error) {
            return next(error);
        }

        res.json("new offer added");
    },

    async unblockReferalUser(req, res, next) {
        let refer_offer;

        try {

            const exist = await ReferalOffer.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("refer offer not exists");
            }

            refer_offer = await ReferalOffer.findOneAndUpdate({ _id: req.params.id }, {
                is_active: true
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("offer unblocked");
    },

    async blockReferalUser(req, res, next) {
        let refer_offer;

        try {

            const exist = await ReferalOffer.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("refer offer not exists");
            }

            refer_offer = await ReferalOffer.findOneAndUpdate({ _id: req.params.id }, {
                is_active: false
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("offer blocked");
    },

    async views(req, res, next) {

        try {

            const referal_offer = await ReferalOffer.findOne({ _id: req.params.id });
            if (!referal_offer) {
                return res.json("refer offer not exists");
            }

            await ReferalOffer.findOneAndUpdate({ _id: req.params.id }, {
                views: referal_offer.views + 1
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("view added");
    },

    async likes(req, res, next) {

        try {

            const referal_offer = await ReferalOffer.findOne({ _id: req.params.id });
            if (!referal_offer) {
                return res.json("refer offer not exists");
            }

            await ReferalOffer.findOneAndUpdate({ _id: req.params.id }, {
                likes: referal_offer.likes + 1
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("like counted");
    }

}

module.exports = referalOfferController;