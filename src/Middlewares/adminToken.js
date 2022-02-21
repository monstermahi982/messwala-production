const JwtService = require("../Services/JwtService");

const adminToken = async (req, res, next) => {

    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json("token not found");
    }

    const token = authHeader.split(" ")[1];

    try {

        const { name, email, admin } = await JwtService.verify(token);
        if (!email) {
            return res.json("not verified")
        }

        if (!admin || admin === false) {
            return res.status(401).json("not verified");
        }

        const adminData = {
            name, email
        }
        req.admin = adminData;

    } catch (error) {
        return next(error);
    }

    next();
}

module.exports = adminToken;