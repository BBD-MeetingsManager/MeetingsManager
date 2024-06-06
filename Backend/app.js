// Todo, replace all insert, update and delete responses, those are data leaks
// Todo, improve the cors, it just accepts anything

const users = require('./Controllers/UserController');
const meetings = require('./Controllers/MeetingController');
const meetingMembers = require('./Controllers/MeetingMembersController');
const friendList = require('./Controllers/FriendListController');
const complexCalls = require('./Controllers/ComplexController');
const auth = require('./Controllers/AuthController');

const express = require("express");
const cors = require('cors');
const app = express();

// Todo, Some cors stuff later
app.use(cors());

// This allows us to read the request body as JSON
app.use(express.json());

app.get('/', function(request, response){
    response.send("Hello world!");
 });

app.use('/auth', auth);
app.use('/user', users);
app.use('/meeting', meetings);
app.use('/friends', friendList);
app.use('/complex', complexCalls);
app.use('/meeting-members', meetingMembers);

app.all('*', function(req, res){
    res.send("API call does not exist");
 });

// Error handling middleware
app.use((error, request, response, next) => {
    response.status(error.status || 500).send({error: error.message || error || 'Internal Server Error'});
});

console.log(
    'App listening on: ',
    'http://localhost:8080/')
app.listen(8080);