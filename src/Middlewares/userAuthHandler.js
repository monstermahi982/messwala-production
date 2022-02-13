const joi = require('joi');
const { ValidationError } = joi;
const userAuthHandler = (err, req, res, next) => {

    let statusCode = 500;
    let data = {
        message: err.message
    }

    // validation error
    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);

}

module.exports = userAuthHandler