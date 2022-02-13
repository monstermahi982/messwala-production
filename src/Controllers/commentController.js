const Comment = require("../Models/comment");
const Joi = require('joi');
const mongoose = require('mongoose');

const commentController = {

    async getComment(req, res, next) {

        let comments = [];

        try {
            comments = await Comment.find().select('-updatedAt -__v').sort({ _id: -1 });
        } catch (error) {
            return next(error);
        }

        res.json(comments)
    },

    async getMessComments(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        let comments = [];

        try {
            comments = await Comment.find({ "mess_id": req.params.id }).select('-updatedAt -__v').sort({ _id: -1 });
        } catch (error) {
            return next(error);
        }

        res.json(comments)

    },

    async deleteComment(req, res, next) {

        // checking object id valid or not
        const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValid) {
            return res.json({ data: "id is not valid" })
        }

        let comment;
        try {
            comment = await Comment.findOneAndRemove({ _id: req.params.id });
        } catch (error) {
            return next(error);
        }

        res.json("comment deleted");
    },

    async addComment(req, res, next) {
        const commentSchema = Joi.object({
            mess_id: Joi.string().max(30).min(3).required(),
            comment: Joi.string().max(100).min(10).required()
        })

        const { error } = await commentSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // getting form body
        const { mess_id, comment } = req.body;
        // getting from token
        const { name, email } = req.user;

        const new_comment = new Comment({
            mess_id,
            name,
            comment,
            email
        })

        let id;

        try {
            const result = await new_comment.save();
            id = result._id;
        } catch (e) {
            return next(e);
        }

        res.json(id)
    }
}

module.exports = commentController;