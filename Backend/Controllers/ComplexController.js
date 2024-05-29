const { parse, isValid } = require('date-fns');

const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

// Todo, dangerous code, should use token
// Get meetings for user.
router.get('/getMeetings', async (request, response, next) => {
    const {userID} = request.query;
    dbContext.query(
        `
            select
                m.meetingID,
                m.title,
                m.description,
                m.link,
                m.startTime,
                m.endTime,
                m.isCancelled
            from Meeting as m
                     inner join MeetingMembers as mm on m.meetingID = mm.meetingID
                     inner join \`User\` as u on u.userID = mm.userID
            where
              mm.status = 'accepted' and
              u.userID = ?
        `,
        [userID],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "That user has no meetings"});
                else response.send(result);
            }
        }
    );
});

// Todo, dangerous code, should use token
// Get meeting invites for user.
router.get('/pendingMeetings', async (request, response, next) => {
    const {userID} = request.query;
    dbContext.query(
        `
            select 
                m.title,
                m.description,
                m.link,
                m.startTime,
                m.endTime,
                m.isCancelled
            from Meeting as m
                inner join MeetingMembers as mm on m.meetingID = mm.meetingID
                inner join \`User\` as u on u.userID = mm.userID
            where 
                1 = 1
                and mm.status = 'pending'
                and u.userID = ?;
        `,
        [userID],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "That user has no pending meetings"});
                else response.send(result);
            }
        }
    );
});

// Todo, unsafe, anyone can be the admin user.
// Create Meeting
router.post('/createMeeting', async (request, response, next) => {
    const {title, description, link, startTime, endTime, members, adminUserID} = request.body;

    // Validating Dates
    const formattedStartTime = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
    const formattedEndTime = parse(endTime, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (!isValid(formattedStartTime) || !isValid(formattedEndTime)) {
        if (!isValid(formattedStartTime)) response.send({alert: "Invalid start time"});
        else response.send({alert: "Invalid end time"});
    }
    else {
        const meetingUUID = crypto.randomUUID();
        dbContext.query(
            `
                insert into 
                    Meeting(meetingID, adminUserID, title, description, link, startTime, endTime) 
                values
                    ('${meetingUUID}', ?, ?, ?, ?, ?, ?)
            `,
            [adminUserID, title, description, link, startTime, endTime],
            (error, result) => {
                if (error) next(error)
                else {
                    // Todo, check if this is vulnerable to sql injections
                    // Inserting Relationships
                    const formattedEmails = `(${members.map(memberEmail => `'${memberEmail}'`).join(', ')})`;
                    dbContext.query(`
                            select userID from \`User\` where userID in ${formattedEmails};
                        `,
                        (error, result) => {
                        if (error) next(error);
                            // Realistically, should never happen, because we check if there are emails.
                            if (error) next(error);
                            else {
                                const valuesArray = [];
                                for (const user of result){
                                    const userID = user.userID;
                                    if (userID === adminUserID) valuesArray.push(`('${userID}', '${meetingUUID}', 'accepted')`);
                                    else valuesArray.push(`('${userID}', '${meetingUUID}', 'pending')`);
                                    valuesArray.push(',');
                                }
                                valuesArray.pop();
                                valuesArray.push(';');

                                dbContext.query(
                                    `
                                        insert into 
                                            MeetingMembers(userID, meetingID, status) 
                                        values 
                                            ${valuesArray.join('')}
                                    `,
                                    (error, result) => {
                                        if (error) {
                                            // Revert insert into meeting table
                                            dbContext.query(`
                                                delete from Meeting where meetingID = ?
                                                `,
                                                [meetingUUID],
                                                (error, result) => {
                                                    // Again, should never happen
                                                    if (error) next(error);
                                                    else response.send({error: "Error creating user relationships."});
                                                }
                                            )
                                        }
                                        else response.send(result);
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }
});

// Todo, not secure, use token
// Get users friends
router.get('/getFriendsForUser', async (request, response, next) => {
    const {email} = request.query;
    dbContext.query(`
            select 
                t.email as 'targetEmail', 
                t.username as 'targetUsername', 
                s.email as 'senderEmail',
                s.username as 'senderUsername'
            from 
                FriendList as f
                inner join \`User\` as t on t.userID = f.targetUserID
                inner join \`User\` as s on s.userID = f.senderUserID
            where
                (t.email = ? or s.email = ?) and
                f.status = 'accepted'
        `,
        [email, email],
        (error, result) => {
            if (error) next(error);
            else if (result.length === 0) response.send({alert: "This user has no accepted friend requests."});
            else {
                const friends = [];
                for (const user of result){
                    friends.push({
                        email: user.targetEmail === email ? user.senderEmail : user.targetEmail,
                        username: user.targetEmail === email ? user.senderUsername : user.targetUsername,
                    });
                }
                response.send({friends});
            }
        }
    )
});

// Todo, not secure, use token
// Get user's friend requests
router.get('/getFriendRequests', async (request, response, next) => {
    const {email} = request.query;
    dbContext.query(`
            select 
                s.email as 'senderEmail',
                s.username as 'senderUsername'
            from 
                FriendList as f
                inner join \`User\` as t on t.userID = f.targetUserID
                inner join \`User\` as s on s.userID = f.senderUserID
            where
                t.email = ? and
                f.status = 'pending'
        `,
        [email],
        (error, result) => {
            if (error) next(error);
            else if (result.length === 0) response.send({alert: "This user has no pending friend requests."});
            else {
                const friends = [];
                for (const user of result){
                    friends.push({
                        email: user.senderEmail,
                        username: user.senderUsername,
                    });
                }
                response.send({friends});
            }
        }
    )
});

module.exports = router