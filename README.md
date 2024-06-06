# MeetingsManager

## Postman

Use this [link](https://app.getpostman.com/join-team?invite_code=86fbcfb0462f951fd07fc3fa07a28b6b&target_code=6d568224b2cbf7d42168ae268cade424) to join the postman workspace. Please do not destroy. Use this for testing.

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

## Frontend

### Running the frontend

This project is a React application created using Vite. This will guide you through the setup and usage of the project.

### Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [Dependencies](#dependencies)

### Prerequisites

Ensure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [Yarn](https://yarnpkg.com/) (latest version recommended)

### Installation

To set up the project on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BBD-MeetingsManager/MeetingsManager.git
   ```
   ```bash
   cd MeetingManager/frontend
   ```
   
2. **Install dependencies:**

  ```bash
  yarn
  ```

### Running the app

To run the application in development mode, use the following command:

  ```bash
  yarn dev
  ```

This will start the development server and open the app in your default web browser. If it doesn't, you can manually open http://localhost:5173 to view it.

### Dependencies

This project uses the following major dependencies:

- React
- Vite

You can find the complete list of dependencies in the `package.json` file.
