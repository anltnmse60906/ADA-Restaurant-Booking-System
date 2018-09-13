var express = require('express');
var router = express.Router();
var User = require("../models/User");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");


/* GET users listing. */
router.post('/sign-up', (req, res) => {
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: bcrypt.hashSync(req.body.password, 10)
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
router.get("/", (req, res) => {
  User.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(error => {
      return res.status(500).json({
        title: "",
        error: err
      });
    })
});
router.post("/sign-in", (req, res) => {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      return res.status(500).json({
        title: "An erorr occured",
        error: err
      });
    }
    if (!user) {
      return res.status(401).json({
        title: "Login failed",
        error: {messages: "Invalid login credentials"}
      });
    }
    console.log("req.body.password: " + req.body.password);
    console.log("user.password: " + user.password);
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: "Login failed",
        error: {messages: "Invalid login credentials"}
      });
    }
    var token = jwt.sign({user: user}, "secret", {expiresIn: 7200});
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
