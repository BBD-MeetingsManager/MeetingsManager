require('dotenv').config();
const express = require('express');
const router = express.Router();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Get Access token
router.get('/getAccessToken', async (request, response, next) => {
    const {code} = request.query;

    const host = request.get('host');

    let redirect;
    if (host.includes('localhost')) redirect = `${request.protocol}://localhost:5173/redirect`;
    else redirect = `${request.protocol}://${host}/redirect`;

    redirect = 'https://levelup-2024.xyz/redirect';

    console.log(redirect);
    console.log(clientID);
    console.log(clientSecret);
    console.log(encodeURI(redirect));
    console.log(code);

    const hostedUiURL = "https://meeting-manager.auth.eu-west-1.amazoncognito.com";
    const url = new URL(`${hostedUiURL}/oauth2/token`);

    const queryParameters = new URLSearchParams();
    queryParameters.append("grant_type", "authorization_code");
    queryParameters.append("client_id", clientID);
    queryParameters.append("code", code);
    queryParameters.append("redirect_uri", encodeURI(redirect));
    queryParameters.append("client_secret", clientSecret);

    url.search = queryParameters.toString();

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(clientID + ':' + clientSecret)}`,
        },
    };

    fetch(url.toString(), options)
        .then(result => result.json()
            .then(asJson => response.send(asJson)));
});

// Doesnt work atm
// Refresh Access token
// router.get('/refreshAccessToken', async (request, response, next) => {
//     const {refreshToken} = request.query;
//
//     const hostedUiURL = "https://meeting-manager.auth.eu-west-1.amazoncognito.com";
//     const url = new URL(`${hostedUiURL}/oauth2/token`);
//
//     const queryParameters = new URLSearchParams();
//     queryParameters.append("grant_type", "refresh_token");
//     queryParameters.append("client_id", clientID);
//     queryParameters.append("refresh_token", refreshToken);
//
//     url.search = queryParameters.toString();
//
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             "Authorization": `Basic ${btoa(clientID + ':' + clientSecret)}`,
//         },
//     };
//
//     fetch(url.toString(), options)
//         .then(result => result.json()
//             .then(asJson => response.send(asJson)));
// });

module.exports = router
