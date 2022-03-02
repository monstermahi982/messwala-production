const Joi = require('joi');
const User = require('../Models/user');
const Referal = require('../Models/referal');
const redis = require('../Database/redis');
const JwtService = require('../Services/JwtService');

const referalController = {


    async getReferalUsers(req, res, next) {

        let refer_user = [];
        try {
            refer_user = await Referal.find({ reward: false, is_active: true }).select('-updatedAt -__v').sort({ refer_count: -1 });
        } catch (error) {
            return next(error);
        }

        res.json(refer_user);
    },

    async getReferalUsersAdmin(req, res, next) {

        let refer_user = [];
        try {
            refer_user = await Referal.find().select('-updatedAt -__v').sort({ refer_count: -1 });
        } catch (error) {
            return next(error);
        }

        res.json(refer_user);
    },

    async deleteReferalUser(req, res, next) {
        let refer_user;
        try {

            const exist = await Referal.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("referral not exists");
            }

            refer_user = await Referal.findOneAndRemove({ _id: req.params.id });

        } catch (err) {
            return next(err);
        }

        res.json("referral user deleted");
    },

    async blockReferalUser(req, res, next) {
        let refer_user;

        try {

            const exist = await Referal.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("refer not exists");
            }

            refer_user = await Referal.findOneAndUpdate({ _id: req.params.id }, {
                is_active: false
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("refer blocked");
    },

    async unblockReferalUser(req, res, next) {
        let refer_user;

        try {

            const exist = await Referal.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("refer not exists");
            }

            refer_user = await Referal.findOneAndUpdate({ _id: req.params.id }, {
                is_active: true
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("refer unblocked");
    },

    async redeemedReferalUser(req, res, next) {
        let refer_user;

        try {

            const exist = await Referal.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("refer not exists");
            }

            refer_user = await Referal.findOneAndUpdate({ _id: req.params.id }, {
                reward: true
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("reward redeemed");
    }

}

module.exports = referalController