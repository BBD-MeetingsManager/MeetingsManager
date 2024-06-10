const rateLimit = require('express-rate-limit');

function limitRate (noRequest) {
    return rateLimit({
        windowMs: 5000,
        max: noRequest || 10,
        message: `You have exceeded ${noRequest} per second`
    });
}

module.exports = limitRate;