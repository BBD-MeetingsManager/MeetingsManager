require('dotenv').config();
const express = require('express');
const router = express.Router();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Get Access token
router.get('/getAccessToken', async (request, response, next) => {
    const {code} = request.query;

    const hostedUiURL = "https://meeting-manager.auth.eu-west-1.amazoncognito.com";
    const url = new URL(`${hostedUiURL}/oauth2/token`);

    const queryParameters = new URLSearchParams();
    queryParameters.append("grant_type", "authorization_code");
    queryParameters.append("client_id", clientID);
    queryParameters.append("code", code);
    queryParameters.append("redirect_uri", encodeURI('https://ec2-34-248-128-133.eu-west-1.compute.amazonaws.com/redirect'));
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