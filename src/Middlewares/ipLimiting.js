const redis = require('../Database/redis');

const ipLimiting = async (req, res, next) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const requests = await redis.incr(ip);

    if (requests == 1) {
        await redis.expire(ip, 60)
    }

    if (requests > 10) {
        return res.status(500).json({ data: "request timeout" });
    }

    next();
}

module.exports = ipLimiting;