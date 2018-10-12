const mongoose = require('../db_init/init');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
    }
  })
;


const User = (module.exports = mongoose.model('User', userSchema));

