const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appSecret = 31340;
require('dotenv').config();

/* GET users listing. */
router.post('/sign-up', (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: bcrypt.hashSync(req.body.password, parseInt(process.env.APP_SECRET || appSecret))
  });
  user.save(function (err, result) {
    if (err) {
      return res.status(500).json({
        title: "",
        error: err
      });
    }
    res.status(201).json({
      message: "User created",
      obj: result
    })
  })
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
      return res.status(401).json({
        title: "Login failed",
        error: {messages: "Invalid login credentials"}
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: "Login failed",
        error: {messages: "Invalid login credentials"}
      });
    }
    const token = jwt.sign({user: user}, process.env.APP_SECRET, {expiresIn: parseInt(process.env.TOKEN_EXPIRE_TIME || 7200)});
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
