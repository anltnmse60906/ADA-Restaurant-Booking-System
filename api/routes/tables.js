var express = require("express");
var router = express.Router();
var Table = require("../models/Table");

router.get("", (reg, res) => {
  Table.find({}, (err, tables) => {
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    res.status(200).json({
      message: "success",
      obj: tables
    })
  });
});

module.exports = router;
