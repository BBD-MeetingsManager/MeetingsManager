require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const region = process.env.REGION;
const userPoolId = process.env.USER_POOL_ID;

const client = jwksClient({
    jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
});

function verifyToken(request, response, next) {
    const token = request.headers.authorization;

    if (!token) {
        next(new Error("No token provided"));
    }
    else {
        jwt.verify(token.split(' ')[1], getKey, {}, (err, decoded) => {
            if (err) {
                next(err);
            } else {
                request.user = decoded;
                next();
            }
        });
    }
}

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

module.exports = verifyToken;