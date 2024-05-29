const users = require('./Controllers/UserController');
const meetings = require('./Controllers/MeetingController');

const express = require("express");
// Todo, Some cors stuff later
// const cors = require('cors');
const app = express();

// Todo, Some cors stuff later
// app.use(cors());

// This allows us to read the request body as JSON
app.use(express.json());

app.get('/', function(request, response){
    response.send("Hello world!");
 });

app.use('/user', users);
app.use('/meeting', meetings);

app.all('*', function(req, res){
    res.send("API call does not exist");
 });

// Error handling middleware
app.use((error, request, response, next) => {
    response.status(error.status || 500).send(error.message || 'error');
});

console.log(
    'App listening on: ',
    'http://localhost:8080/')
app.listen(8080);