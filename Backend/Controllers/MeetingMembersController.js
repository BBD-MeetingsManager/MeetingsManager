const verifyToken = require('../VerifyToken');
const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');
const limitRate = require("../RateLimit");

router.get('/', (request, response) => {
    response.send('MeetingMembers Homepage');
});


// Todo, out how to send better response to front end without exposing information
// Accept / reject meeting invites
router.put('/handleRequest', verifyToken, limitRate(5), (request, response, next) => {
    const {meetingID, status} = request.body;
    const email = request.user.email;
    if (status !== 'accepted' && status !== 'rejected') response.send({alert: "Invalid status. Only \'accepted\' or \'rejected\' are allowed."});
    else {
        dbContext.query(`
                update MeetingMembers as mm
                inner join \`User\` as u on mm.userID = u.userID
                set mm.status = ?
                where 
                    mm.meetingID = ? and
                    u.email = ?
            `,
            [status, meetingID, email],
            (error, result) => {
                if (error) response.send({success: "Success"});
                else response.send({success: "Success"});
            }
        );
    }
});

module.exports = router
