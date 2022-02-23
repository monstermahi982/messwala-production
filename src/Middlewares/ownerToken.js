const JwtService = require("../Services/JwtService");

const ownerToken = async (req, res, next) => {

    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json("token not found");
    }

    const token = authHeader.split(" ")[1];

    try {

        const { name, email, owner_status } = await JwtService.verify(token);
        if (!owner_status) {
            return res.json("not verified")
        }

        if (!owner_status || owner_status === false) {
            return res.status(401).json("not verified");
        }

        const ownerData = {
            name, email
        }
        req.user = ownerData;

    } catch (error) {
        return next(error);
    }

    next();
}

module.exports = ownerToken;