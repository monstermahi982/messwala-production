const Comment = require('../Models/comment');
const View = require('../Models/view');
const Mess = require('../Models/mess');
const User = require('../Models/user');
const Action = require('../Models/action');

const staticsController = {

    async owner(req, res, next) {
        let comments;
        let likes;
        let dislikes;
        let views;

        try {

            comments = await Comment.find({ mess_id: req.params.id }).count();
            likes = await Action.find({ mess_id: req.params.id, like: true }).count();
            dislikes = await Action.find({ mess_id: req.params.id, dislike: true }).count();
            views = await View.find({ mess_id: req.params.id }).count();

        } catch (error) {
            return next(error);
        }

        const data = {
            comments, likes, dislikes, views
        }

        res.json(data)
    },

    async totalUser(req, res, next) {

        let activeUser;
        let blockUsers;
        let activeOwner;
        let blockOwner;

        try {

            activeOwner = await Mess.find({ is_active: true }).count();
            blockOwner = await Mess.find({ is_active: false }).count();
            activeUser = await User.find({ is_active: true }).count();
            blockUsers = await User.find({ is_active: false }).count();

        } catch (error) {
            return next(error);
        }

        const data = {
            activeUser, blockUsers, activeOwner, blockOwner
        }

        res.json(data)
    },

    async todays(req, res, next) {

        let comments;
        let likes;
        let dislikes;
        let views;

        try {

            comments = await Comment.find().count();
            likes = await Action.find({ like: true }).count();
            dislikes = await Action.find({ dislike: true }).count();
            views = await View.find().count();

        } catch (error) {
            return next(error);
        }

        const data = {
            comments, likes, dislikes, views
        }

        res.json(data)
    }

}

module.exports = staticsController;