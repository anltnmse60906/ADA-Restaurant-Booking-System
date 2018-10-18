const mongoose = require('mongoose');
const utils = require("../utils/utils");
require('dotenv').config();

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://"+ process.env.MONGO_DB_URL || utils.AppSecrete + "/ada-res-booking")

  .then(() => {
    console.log('Successfully connected to database')
  })

  .catch(error => {
    console.error('Error connecting to MongoDB database', error)
  })

module.exports = mongoose;
