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

# Clone the repo and Setup on Back-end

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

By default, the host of the MongoDB is that: `localhost:27017`

## 3. Register OAUTH 2.0 authorisation of Google to access Gmail for sending email.
This application uses web OAUTH 2.0 authorisation to access Google APIs from this website. See the instruction in [here](https://developers.google.com/identity/protocols/OAuth2UserAgent) for more detail about the OAUTH 2.0

In short, what you need to do is that:

1. Go to [Google API Console](https://console.developers.google.com/apis/credentials) to create a web-client
2. If you don't have any Google project, you have to create a Google project. If you already have the Google project, go to `step 4` to create a new web-client
3. You have to make configuration on `OAuth consent screen`
4. Create new credentials by click on `Create credentials`
5. Select `OAuth client ID`
6. Select `Web application`
7. On "Authorized redirect URIs", you have to pass the URL=`https://developers.google.com/oauthplayground`. This step is very important because we have to generate the "Refresh Token" from this website
8. After you finish create your web-client, go to [this website](https://developers.google.com/oauthplayground), to generate the "Refresh Token"
9. Make a configuration like this image 
![alt text](https://raw.githubusercontent.com/anltnmse60906/ADA-Restaurant-Booking-System/master/api/public/images/Screen%20Shot%202018-10-19%20at%201.01.02%20am.png)
10. It goes to step 2, you click on "Exchange authorisation code for tokens"
11. The "Refresh token" will be generate.
12. Go to `client_secrete.json` file and pass your information
There are 4 important information that we need for sending an email:
      1. `client_id`: is your Client ID
      2. `client_secret`: is your Client Secret
      3. `refresh_toke`: is your Refresh Token
      4. `user_email`: is the e-mail that you register your application (send from)

## 4. Setup environment variables
Go to file `.env`, under the folder `/api/`

`APP_SECRET` is the string for encrypt your token, by default: `something secrete`

`TOKEN_EXPIRE_TIME` is time for token expiration, by default: `7200`
 
`MONGO_DB_URL` is the host of MongoDB, by default:`localhost:27017`
 
## 5. Install all the required library need for back-end and
Install all the required libraries
```
npm install
```

## 6. Initialising the Table Map of the restaurant
After finishing MongoDB and start the MongoDB, navigate to `api` folder to initialise the Tables layout of the restaurant.

If you have not installed the `yarn` package, see the instruction here [yarn package installation](https://yarnpkg.com/lang/en/docs/install/) to install `yarn` package

```
yarn seed
```
To clean the data of all table, use the follow command on the `api` folder 
```
yarn seed
```
## 7. Start back-end server

Start the server

```
npm start
```

By default, the back-end server run on port :3000


# Setup on front-end
Navigate to `web` folder

## 1. Install all the required libraries for the front-end.
```
npm install
```

## 2. Change back-end host
If you deploy a back-end on the other server, go to folder `web/src/enviroments` and edit file `environment.ts`.

Change `backEndHost` to the host that you deploy back-end server. By default the back-end host is: `localhost:3000`

## 3. Deploy and start the front-end
```
ng serve
```

By default, the front-end will run on port `:4200`, you could change to other port by:`
```
ng serve --port <YOUR PORT> (4201)
```


# The document about the APIs published from the back-end
After the back-end is deployed successfully, the document about the APIs is also viewed by this url: `yourbackendhost:PORT/api-docs/`, for example `http://localhost:3000/api-docs/`
![alt API Document](https://raw.githubusercontent.com/anltnmse60906/ADA-Restaurant-Booking-System/master/api/public/images/Screen%20Shot%202018-10-19%20at%202.51.03%20am.png)




  
