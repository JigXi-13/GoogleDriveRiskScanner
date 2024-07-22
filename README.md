# Google Drive Risk Analysis Scanner

## Overview

This project is a Google Drive Risk Analysis app where users can view the complete report if the Drive is leaking some sensitive data. It uses modern web technologies to ensure the application is responsive, visually appealing and scalable.

## Demo of the App:

   [Drive Risk Scanner](https://www.youtube.com/watch?v=uhfpIlIOTM4)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)

## Features

- Connect to G-Drive API
- View risk analysis report of googel drive files
- Revoke / Logout from G-Drive API

## Technologies Used

### Frontend

- ReactJS with TypeScript
- Material UI

### Backend

- Node.js
- Express.js

### Database

- MySQL

### API

- [G-Drive API](https://developers.google.com/drive/api/guides/about-sdk)

## Setup and Instructions

1. **Set up environment variables:**
   Create a .env file in the root directory and add the following:

   ```sh
    - **CLIENT_ID**: The client ID obtained from the Google Developers Console.
    - **CLIENT_SECRET**: The client secret obtained from the Google Developers Console.
    - **REDIRECT_URI**: The redirect URI configured in the Google Developers Console for OAuth2 callbacks.
    - **SESSION_SECRET**: A secret key used for session encryption.
    - **DB_CONFIG_PWD**: The password for accessing the MySQL database.
    - **DB_CONFIG_HOST**: The host address of the MySQL database.
    - **DB_CONFIG_USER**: The username for accessing the MySQL database.
    - **DB_CONFIG_DATABASE**: The name of the MySQL database.
    - **PORT**: The port on which the server will run.
   
2. **Instructions:**
   1. Clone the repository to your local machine.
   2. Create a `.env` file in the root directory of the project.
   3. Add the above configuration details to the `.env` file.
   4. Install the necessary dependencies by running `npm install`.
   5. Start the server by running `npm start`.
   6. Open `http://localhost:5050` in your browser to use the application.

   
### Description of Configuration Variables






## Usage

- Open your browser and navigate to http://localhost:3000
