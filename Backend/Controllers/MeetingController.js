const verifyToken = require('../VerifyToken');
const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('Meeting Homepage');
});

// Cancel meeting
router.put('/cancelMeeting', verifyToken, async (request, response, next) => {
    const {meetingID} = request.body;
    const email = request.user.email;
    dbContext.query(`
            update Meeting m 
            inner join \`User\` u on u.userID = m.adminUserID
            set m.isCancelled = true
            where
                u.email = ? and
                m.meetingID = ?;
        `,
        [email, meetingID],
        (error, result) => {
            if (error) response.send({success: "Success"});
            else response.send({success: "Success"});
        }
    );
});

module.exports = router