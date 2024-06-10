const { v4: uuidv4 } = require('uuid');
const { parse, isValid } = require('date-fns');

const verifyToken = require('../VerifyToken');
const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

// Get meetings for user.
router.get('/getMeetings', verifyToken, async (request, response, next) => {
    const email = request.user.email;
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
              u.email = ?
            order by
                m.startTime
            limit
                5;
        `,
        [email],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "That user has no meetings"});
                else response.send(result);
            }
        }
    );
});

// Get meeting invites for user.
router.get('/pendingMeetings', verifyToken, async (request, response, next) => {
    const email = request.user.email;
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
                1 = 1
                and mm.status = 'pending'
                and u.email = ?;
        `,
        [email],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "That user has no pending meetings"});
                else response.send(result);
            }
        }
    );
});

// Create Meeting
router.post('/createMeeting', verifyToken, async (request, response, next) => {
    const {title, description, link, startTime, endTime, members} = request.body;
    const email = request.user.email;
    members.push(email);

    // Validating Dates
    const formattedStartTime = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
    const formattedEndTime = parse(endTime, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (!isValid(formattedStartTime) || !isValid(formattedEndTime)) {
        if (!isValid(formattedStartTime)) response.send({alert: "Invalid start time"});
        else response.send({alert: "Invalid end time"});
    }
    else {
        dbContext.query(`
                select userID from \`User\` where email = ?;
            `,
            [email],
            (error, result) => {
                if (error) response.send({success: "Success"});
                else {
                    const adminUserID = result[0].userID;
                    const meetingUUID = uuidv4();
                    dbContext.query(
                        `
                            insert into 
                                Meeting(meetingID, adminUserID, title, description, link, startTime, endTime) 
                            values
                                ('${meetingUUID}', ?, ?, ?, ?, ?, ?)
                        `,
                        [adminUserID, title, description, link, startTime, endTime],
                        (error, result) => {
                            if (error) response.send({success: "Success"});
                            else {
                                // Todo, check if this is vulnerable to sql injections
                                // Inserting Relationships
                                const formattedEmails = `(${members.map(memberEmail => `'${memberEmail}'`).join(', ')})`;
                                dbContext.query(`
                                        select userID from \`User\` where email in ${formattedEmails};
                                    `,
                                    (error, result) => {
                                        if (error) response.send({success: "Success"});
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
                                                                if (error) response.send({success: "Success"});
                                                                else response.send({success: "Success"});
                                                            }
                                                        )
                                                    }
                                                    else response.send({success: "Success"});
                                                }
                                            )
                                        }
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

// Get users friends
router.get('/getFriendsForUser', verifyToken, async (request, response, next) => {
    const email = request.user.email;
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
                response.send(friends);
            }
        }
    )
});

// Get user's friend requests
router.get('/getFriendRequests', verifyToken, async (request, response, next) => {
    const email = request.user.email;
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
                response.send(friends);
            }
        }
    )
});

router.get('/getMeetingDetails', verifyToken, async (request, response, next) => {
    const email = request.user.email;
    const {meetingID} = request.query;

    dbContext.query(`
                with MeetingDetails as (
                    select 
                        m.meetingID,
                        m.title,
                        m.description,
                        m.link,
                        m.startTime,
                        m.endTime,
                        m.isCancelled,
                        umm.email,
                        umm.username,
                        case
                            when m.adminUserID = umm.userID then true
                            else false
                        end as isAdmin
                    from Meeting as m
                        inner join \`User\` as u on m.adminUserID = u.userID
                        inner join MeetingMembers as mm on m.meetingID = mm.meetingID
                        inner join \`User\` as umm on umm.userID = mm.userID
                    where m.meetingID = ?
                )
                select * from MeetingDetails
                where 
                    exists (
                        select 1
                        from MeetingDetails as md
                        where md.email = ?
                    );
        `,
        [meetingID, email],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "This user  is not in this meeting."});
                else response.send(result);
            }
        }
    )
})

module.exports = router