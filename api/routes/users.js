const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utils = require("../utils/utils");
require('dotenv').config();

/* GET users listing. */
router.post('/sign-up', (req, res) => {
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: bcrypt.hashSync(req.body.password, 10)
  });
  User.findOne({email: req.body.email}, function (err, foundUser) {
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    if (foundUser) {
      return res.status(409).json({
        title: "Email is registered",
        error: {
          messages: "Email is registered"
        }
      });
    }
    user.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: "An error occurred",
          error: err
        });
      }
      res.status(200).json({
        message: "User signs up successfully",
      })
    })

  });

});

router.post("/sign-in", (req, res) => {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    if (!user) {
      return res.status(400).json({
        title: "Login failed",
        error: {messages: "Invalid login credentials"}
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).json({
        title: "Login failed",
        error: {messages: "Invalid login credentials"}
      });
    }
    var token = jwt.sign({user: user}, process.env.APP_SECRET || utils.AppSecrete, {expiresIn: utils.TokenExpiredTime});
    res.status(200).json({
      message: "Success logged in",
      token: token,
      lastName: user.lastName,
      firstName: user.firstName,
      userId: user._id
    })
  })
});


module.exports = router;
