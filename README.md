# MeetingsManager

## Postman
Use this [link](https://app.getpostman.com/join-team?invite_code=86fbcfb0462f951fd07fc3fa07a28b6b&target_code=6d568224b2cbf7d42168ae268cade424
) to join the postman workspace. Please do not destroy. Use this for testing.

## Backend
In VSCode, (I havent tested yet!), you can run with: `node app.js` in the back end folder.  
Please do make sure you have a local db with the data, run the flyway scritps in order.  
Also, make sure your env file has those details

### Running the backend.
Plaese ensure that you have a .env file in your root folder. This will hold the secrets for initiating a connection to the database.  
The values the backend is looking are (I will add an example):
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=password
- DB_NAME=messagemanager