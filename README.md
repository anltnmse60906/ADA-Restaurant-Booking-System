# Restaurant Booking System

This website is for customer to reserve the table in the restaurant. 

Customer is able to view the table layout of the restaurant and book the seat you prefered.

This is a full stack project built with:

#### Back-end:
- MongoDB
- Express
- Node.js

#### Front-end:
- Angular

### How To Start

Clone the repo
```
git clone https://github.com/anltnmse60906/ADA-Restaurant-Booking-System
```
#### Start MongoDB process

## Set up database server

Run
```
mongod
```

### Open another terminal to run database shell
Run
```
mongo
```

#### Backend
Change to the backend `api` folder.

Initialise the table
```
yarn seed
```
Clean the database
```
yarn drop
```

```
# Enter frontend folder
cd api
# Install backend dependency
npm install
# Start the server
npm start
```
The server runs on port 4200.

#### Frontend



Change to the frontend `web` folder.

```
# Enter frontend folder
cd web
# Install frontend dependency
npm install
# Build our app
ng serve
```
The client runs on port 3000.

Open in your browser and navigate to http://localhost:4200.

  
