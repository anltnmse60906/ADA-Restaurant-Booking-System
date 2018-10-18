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

#How To Start

## 1.Clone the repo
```
git clone https://github.com/anltnmse60906/ADA-Restaurant-Booking-System
```
There are two repositories in this application: `api` and `web`. 
`api` contains source code for back-end and `web` contains source code for front-end

## 2. MongoDB
MongoDB is used for store data of back-end. We have to set up MongoDB first. 
See instructions [here](https://docs.mongodb.com/manual/administration/install-community/) 
to install the versions of your OS

## 3.Initialising the Table Map of the restaurant
After finishing MongoDB and start the MongoDB, navigate to `api` folder to initialise the Tables layout of the restaurant.

```
yarn seed
```
To clean the data of all table, use the follow command on the `api` folder 
```
yarn seed
```
## 3. Register OAUTH 2.0 authorisation of Google to access Gmail for sending email.
This application uses web OAUTH 2.0 authorisation to access Google APIs from this website. See the instruction in [here](https://developers.google.com/identity/protocols/OAuth2UserAgent) for more detail about the OAUTH 2.0

In short, what you need to do is that:
##### 1. Go to [Google API Console](https://console.developers.google.com/apis/credentials) to create a web-client
1. If you dont have any Google project, you have to create a Google project
2. You have to make configuration on "OAuth consent screen"
3. Create new credentials by click on "Create credentials"
4. Select "OAuth client ID"
5. Select "Web application"
6. On "Authorized redirect URIs", you have to pass the URL="https://developers.google.com/oauthplayground". This step is very important because we have to generate the "Refresh Token" from this website
7. Go to [this website](https://developers.google.com/oauthplayground), 
8.  
![alt text](https://raw.githubusercontent.com/username/projectname/branch/path/to/img.png)

3 If you have not had any web application on Google API Console, 

##### 2. After you create web-client successfully, there are two important information is that: Client ID and Client secrete.
##### 3.



## Backend

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

  
