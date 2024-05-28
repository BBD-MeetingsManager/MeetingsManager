const express = require('express');
const router = express.Router();
const dbContext = require('../dataSource');

router.get('/', (request, response) => {
    response.send('User Homepage');
});

// Todo, dangerous code, should use token
// Get user with userID
router.get('/userID', async (request, response, next) => {
    const {userID} = request.query;
    dbContext.query(
        'select * from `User` where userID = ?',
        [userID],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.length === 0) response.send({alert: "No user found"});
                else response.send(result);
            }
        }
    );
});

// Todo, also dangerous, should use token
// Login / Sign Up
router.post('/login', async (request, response, next) => {
    const {email} = request.body;
    dbContext.query(
        'select * from `User` where email = ?',
        [email],
        (error, result) => {
            if (error) next(error)
            else {
                if (result.length !== 0) response.send(result);
                else {
                    dbContext.query(
                        'insert into `User`(email) values (?)',
                        [email],
                        (error, result) => {
                            if (error) next(error);
                            else response.send(result);
                        }
                    )
                }
            }
        }
    )
});

// Edit your username
// Todo, of course, protect me with token
// Todo, people will change other people's usernames, protect aginst this.
router.put('/editUsername', async (request, response, next) => {
    const {username} = request.body;
    const {email} = request.body;
    dbContext.query(
        'update `User` set username = ? where email = ?',
        [username, email],
        (error, result) => {
            if (error) next(error);
            else {
                if (result.changedRows === 0) response.send({alert: "That username was already in use."});
                else response.send(result);
            }
        }
    )
});

module.exports = router