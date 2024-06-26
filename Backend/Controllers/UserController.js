const verifyToken = require('../VerifyToken');
const limitRate = require('../RateLimit');
const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('User Homepage');
});

// Login / Sign Up
router.post('/login', verifyToken, limitRate(10), async (request, response, next) => {
    const email = request.user.email;
    dbContext.query(
        'select * from `User` where email = ?',
        [email],
        (error, result) => {
            if (error) response.send({success: "Success"});
            else {
                if (result.length !== 0) response.send(result);
                else {
                    dbContext.query(
                        'insert into `User`(email) values (?)',
                        [email],
                        (error, result) => {
                            response.send({success: "Success"});
                        }
                    )
                }
            }
        }
    )
});

// Edit your username
router.put('/editUsername', verifyToken, limitRate(5), async (request, response, next) => {
    const {username} = request.body;
    const email = request.user.email;
    dbContext.query(
        'update `User` set username = ? where email = ?',
        [username, email],
        (error, result) => {
            if (error) response.send({success: "Success"});
            else {
                if (result.changedRows === 0) response.send({alert: "That username was already in use."});
                else response.send({success: "Success"});
            }
        }
    )
});

// Get username and email
router.get('/getMyDetails', verifyToken, limitRate(100), async (request, response, next) => {
    const email = request.user.email;
    dbContext.query(`
            select email, username
            from \`User\`
            where email = ?`,
        [email],
        (error, result) => {
            if (error) next(error);
            else response.send(result);
        }
    )
});

module.exports = router