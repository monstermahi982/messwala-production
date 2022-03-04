const Joi = require('joi');
const User = require('../Models/user');
const Referal = require('../Models/referal');
const redis = require('../Database/redis');
const JwtService = require('../Services/JwtService');

const userAuthController = {


    async getUsers(req, res, next) {

        let users = [];
        try {
            users = await User.find().select('-updatedAt -__v').sort({ _id: -1 });
        } catch (error) {
            return next(error);
        }

        res.json(users);
    },

    async deleteUser(req, res, next) {
        let user;
        try {

            const exist = await User.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("user not exists");
            }

            user = await User.findOneAndRemove({ _id: req.params.id });

        } catch (err) {
            return next(err);
        }

        res.json("user deleted");
    },

    async register(req, res, next) {

        const registerSchema = Joi.object({
            name: Joi.string().max(50).min(3).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().length(10).pattern(/^[0-9]+$/).allow(''),
            refer_id: Joi.string().allow('')
        })

        const { error } = await registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { name, email, phone, refer_id } = req.body;

        // checking user in db
        try {
            const exist = await User.findOne({ email })
            if (exist) {
                if (!exist.is_active) {
                    return res.json("blocked");
                }
                return res.json("email is already exists");
            }

        } catch (e) {
            return next(e);
        }

        try {

            if (refer_id) {

                const referal_user_exists = await User.findOne({ refer_id });

                let referal_user;

                if (referal_user_exists) {

                    const refer_data = await Referal.findOne({ refer_id });

                    if (refer_data) {

                        referal_user = await Referal.findOneAndUpdate({ refer_id }, {
                            refer_count: refer_data.refer_count + 1
                        }, { new: true });

                    } else {

                        const new_referal = Referal({
                            name: referal_user_exists.name, refer_id: referal_user_exists.refer_id
                        })

                        referal_user = await new_referal.save();

                    }

                }

            }

        } catch (error) {
            return next(error);
        }


        const user = new User({
            name,
            email,
            phone
        })

        let token;

        try {
            const result = await user.save();
            token = await JwtService.sign({ id: result._id, name: result.name, email: result.email, refer_id: result.refer_id });
        } catch (e) {
            return next(e);
        }

        res.json(token)
    },

    async login(req, res, next) {

        const registerSchema = Joi.object({
            email: Joi.string().email().required(),
        })

        const { error } = await registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email } = req.body;


        let token;

        try {

            // checking user in db
            const exist = await User.exists({ email });
            if (!exist) {
                return res.json("user not found");
            }

            // validating user
            const user = await User.findOne({ email: email }).select('-updatedAt -__v');
            if (user) {

                if (!user.is_active) {
                    return res.json("your account is blocked");
                }

                token = JwtService.sign({ name: user.name, id: user._id, email: user.email, refer_id: user.refer_id });
            }

        } catch (e) {
            return next(e);
        }

        res.json(token)
    },

    async blockUser(req, res, next) {
        let user;

        try {

            const exist = await User.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("user not exists");
            }

            user = await User.findOneAndUpdate({ _id: req.params.id }, {
                is_active: false
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("user blocked");
    },

    async unblockUser(req, res, next) {
        let user;

        try {

            const exist = await User.exists({ _id: req.params.id });
            if (!exist) {
                return res.json("user not exists");
            }

            user = await User.findOneAndUpdate({ _id: req.params.id }, {
                is_active: true
            }, { new: true })

        } catch (error) {
            return next(error);
        }

        res.json("user unblocked");
    }

}

module.exports = userAuthController