const mongoose = require('./init');
const passportLocalMongoose = require("passport-local-mongoose");

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
    }
  })
;




const User = (module.exports = mongoose.model('User', userSchema));

