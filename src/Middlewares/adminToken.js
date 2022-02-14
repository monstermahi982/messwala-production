const JwtService = require("../Services/JwtService");

const adminToken = async (req, res, next) => {

    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json("token not found");
    }

    const token = authHeader.split(" ")[1];

    try {

        const { name, email } = await JwtService.verify(token);
        if (!email) {
            return res.json("not verified")
        }
        const admin = {
            name, email
        }
        req.admin = admin;

    } catch (error) {
        return next(error);
    }

    next();
}

module.exports = adminToken;