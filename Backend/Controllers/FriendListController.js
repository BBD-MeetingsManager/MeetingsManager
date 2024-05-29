const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('Meeting Homepage');
});

// Todo, dangerous code, should use token
// Todo, add extended functionality that if you send a request and they sent one to you, it must just accept the request.
// Make follow request
router.post('/makeRequest', async (request, response, next) => {
    const {targetEmail, senderEmail} = request.body;
    dbContext.query(
        `select userID, email from \`User\` where email in (?, ?)`,
        [targetEmail, senderEmail],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length !== 2) next({error: "Internal server error"});
                else {
                    const targetUser = result.find(user => user.email === targetEmail)
                    const senderUser = result.find(user => user.email === senderEmail);

                    // Find if you already have a request going
                    dbContext.query(`
                                select \`status\`
                                from friendlist
                                where
                                    (targetUserID = ? and senderUserID = ?) or
                                    (senderUserID = ? and targetUserID = ?);
                        `,
                        [targetUser.userID, senderUser.userID, senderUser.userID, targetUser.userID],
                        (error, result) => {
                            if (error) next(error);
                            else {
                                if (result.length === 0){
                                    // First time request is being made, so do this.
                                    dbContext.query(`
                                        insert into FriendList(targetUserID, senderUserID)
                                        values (?, ?);`,
                                        [targetUser.userID, senderUser.userID],
                                        (error, result) => {
                                            if (error) next(error);
                                            else response.send(result);
                                        }
                                    )
                                }
                                else if (result[0].status === 'accepted') response.send({alert: "You are already friends."});
                                else if (result[0].status === 'pending') response.send({alert: "The friend request has already been sent."});
                                else {
                                    dbContext.query(`
                                        update FriendList 
                                        set \`status\` = 'pending'
                                        where 
                                            (targetUserID = ? and senderUserID = ?) or
                                            (senderUserID = ? and targetUserID = ?)`,
                                        [targetUser.userID, senderUser.userID, senderUser.userID, targetUser.userID],
                                        (error, result) => {
                                            if (error) next(error);
                                            else response.send(result);
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
            }
        }
    );
});


// Todo, also dangerous, use token
// Todo, out how to send better response to front end without exposing information
router.put('/handleRequest', (request, response, next) => {
    const {targetEmail, senderEmail, status} = request.body;
    if (status !== 'accepted' && status !== 'rejected') response.send({alert: "Invalid status. Only \'accepted\' or \'rejected\' are allowed."});
    else {
        dbContext.query(`
        select userID, email from \`User\` where email in (?, ?)`,
            [targetEmail, senderEmail],
            (error, result) => {
                if (error) next(error);
                else {
                    if (result.length !== 2) next({error: "Internal server error"});
                    else {
                        const targetUser = result.find(user => user.email === targetEmail)
                        const senderUser = result.find(user => user.email === senderEmail);

                        dbContext.query(`
                                update FriendList
                                set \`status\` = ?
                                where targetUserID = ? and senderUserID = ?;
                            `,
                            [status, targetUser.userID, senderUser.userID],
                            (error, result) => {
                                if (error) next(error);
                                else response.send(result);
                            }
                        )
                    }
                }
            }
        );
    }
});

module.exports = router
