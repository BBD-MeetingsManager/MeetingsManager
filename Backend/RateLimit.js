const rateLimit = require('express-rate-limit');

function limitRate (noRequest = 10) {
    return rateLimit({
        windowMs: 1000,
        max: noRequest,
        message: `You have exceeded ${noRequest} per second`
    });
}

module.exports = limitRate;