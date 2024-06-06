const verifyToken = require('../VerifyToken');
const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('Meeting Homepage');
});

// Todo, add extended functionality that if you send a request and they sent one to you, it must just accept the request.
// Make follow request
router.post('/makeRequest', verifyToken, async (request, response, next) => {
    const {targetEmail} = request.body;
    const senderEmail = request.user.email;
    dbContext.query(
        `select userID, email from \`User\` where email in (?, ?)`,
        [targetEmail, senderEmail],
        (error, result) => {
            if (error) response.send({success: "Success"});
            else {
                if (result.length !== 2) response.send({success: "success"});
                else {
                    const targetUser = result.find(user => user.email === targetEmail);
                    const senderUser = result.find(user => user.email === senderEmail);

                    // Find if you already have a request going
                    dbContext.query(`
                                select \`status\`
                                from friendlist
                                where
                                    (targetUserID = ? and senderUserID = ?) or
                                    (senderUserID = ? and targetUserID = ?);
                        `,
                        [targetUser.userID, senderUser.userID, targetUser.userID, senderUser.userID],
                        (error, result) => {
                            if (error) response.send({success: "Success"});
                            else {
                                if (result.length === 0){
                                    // First time request is being made, so do this.
                                    dbContext.query(`
                                        insert into FriendList(targetUserID, senderUserID)
                                        values (?, ?);`,
                                        [targetUser.userID, senderUser.userID],
                                        (error, result) => {
                                            if (error) response.send({success: "Success"});
                                            else response.send({success: "Success"});
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
                                        [targetUser.userID, senderUser.userID, targetUser.userID, senderUser.userID],
                                        (error, result) => {
                                            response.send({success: "Success"});
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


// Todo, out how to send better response to front end without exposing information
// Accept / reject friend requests
router.put('/handleRequest', verifyToken, (request, response, next) => {
    const {senderEmail, status} = request.body;
    const targetEmail = request.user.email;
    if (status !== 'accepted' && status !== 'rejected') response.send({alert: "Invalid status. Only \'accepted\' or \'rejected\' are allowed."});
    else {
        dbContext.query(`
        select userID, email from \`User\` where email in (?, ?)`,
            [targetEmail, senderEmail],
            (error, result) => {
                if (error) next(error);
                else {
                    if (result.length !== 2) response.send({success: "success"});
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
                                else response.send({success: "success"});
                            }
                        )
                    }
                }
            }
        );
    }
});

module.exports = router
