const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('Meeting Homepage');
});

// Todo, dangerous code, should use token
// Cancel meeting
router.put('/cancelMeeting', async (request, response, next) => {
    const {meetingID, email} = request.body;
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
            if (error) next(error);
            else response.send(result);
        }
    );
});

module.exports = router