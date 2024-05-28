const { parse, isValid } = require('date-fns');

const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('Meeting Homepage');
});

// Todo, dangerous code, should use token
// Todo Will improve this to only get meeting details specific to a users token
// Get meeting with meetingID
router.get('/meetingID', async (request, response, next) => {
    const {meetingID} = request.query;
    dbContext.query(
        'select * from Meeting where meetingID = ?',
        [meetingID],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "No meeting found"});
                else response.send(result);
            }
        }
    );
});

// Create Meeting
router.post('/createMeeting', async (request, response, next) => {
    const {title, description, link, startTime, endTime} = request.body;

    // Validating Dates
    const formattedStartTime = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
    const formattedEndTime = parse(endTime, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (!isValid(formattedStartTime) || !isValid(formattedEndTime)) {
        if (!isValid(formattedStartTime)) response.send({alert: "Invalid start time"});
        else response.send({alert: "Invalid end time"});
    }
    else {
        dbContext.query(
            `insert into Meeting(title, description, link, startTime, endTime) values(?, ?, ?, ?, ?)`,
            [title, description, link, startTime, endTime],
            (error, result) => {
                if (error) next(error)
                else response.send(result);
            }
        )
    }
});

module.exports = router