const JwtService = require("../Services/JwtService");

const auth = async (req, res, next) => {

    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({ data: "token not found" });
    }

    const token = authHeader.split(" ")[1];

    try {

        const { id, name, email } = await JwtService.verify(token);
        if (!email) {
            return res.json({ data: "not verified" })
        }
        const user = {
            name, email, id
        }
        req.user = user;

    } catch (error) {
        return next(error);
    }

    next();
}

module.exports = auth;