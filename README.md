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

## Setup and Installation

1. **Set up environment variables:**
   Create a .env file in the root directory and add the following:

   ```sh
    NODE_ENV = development
    PORT = 3500
    MONGO_URI = your_mongodb_connection_string
    JWT_SECRET = your_jwt_secret
2. **Install dependencies:**
   Run this command at the root level.
   ```sh
    npm run build
3. **Run the application:**
   
   ```sh
   Run this command to start the backend server:
   npm run dev

   Now, in the other terminal run these commands to start the frontend server:
   cd frontend/
   npm run start

## Usage

- Open your browser and navigate to http://localhost:3000
