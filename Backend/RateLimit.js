const rateLimit = require('express-rate-limit');

function limitRate (noRequest) {
    return rateLimit({
        windowMs: 1000,
        max: noRequest || 10,
        message: `You have exceeded ${noRequest || 10} per second`
    });
}

module.exports = limitRate;