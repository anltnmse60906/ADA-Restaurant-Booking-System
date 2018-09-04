var express = require("express");
var router = express.Router();
var Table = require("../models/Table");
var User = require("../models/User");
const momentTimezone = require('moment-timezone');
const moment = require('moment');

const DateTimeTemplate = "DD-MM-YYYY";
/*
* section
* get date
*
* */
router.get("", (req, res) => {
  Table.find({}).exec((err, tables) => {

    if (err) {
      return res.status(500).json({
        title: "An error occured!",
        error: err
      });
    }
    if (!tables) {
      return res.status(500).json({
        title: "Table is not found",
        error: {
          message: "Table is not found"
        }
      });
    }
    let inputSection = parseInt(req.query.section);
    let inputDate = dateAEST(req.query.bookingDate).format(DateTimeTemplate);
    let currentTables = [];

    for (let t of tables) {
      let tblIsBooked = false;
      for (let b of t.bookings) {
        if (b.section === inputSection && dateAEST(b.bookingDate).format(DateTimeTemplate) === inputDate) {
          tblIsBooked = true;
        }
      }
      let curTable = {
        _id: t._id,
        name: t.name,
        capacity: t.capacity,
        isSmoking: t.isSmoking,
        location: t.location,
        isBooked: tblIsBooked,
      }
      currentTables.push(curTable);
    }

    if (err) return handleError(err);
    return res.status(200).json({
      title: "Table is reserved successfully",
      obj: currentTables
    });
  });
});


/*
* List of table[]
* Section
* Date
* Requirement
* UserId
*
*
* */
router.post("/create-new-booking", (req, res) => {
  User.findById(req.body.userId, (err, user) => {

    if (err) {
      return res.status(500).json({
        title: "An error occured!",
        error: err
      });
    }
    if (!user) {
      return res.status(500).json({
        title: "User is not found",
        error: {
          message: "User is not found"
        }
      });
    }
    Table.findOne({_id: req.body.bookingTable._id}).populate(
      {
        path: "booking",
        match: {
          // table: req.body.tableId,
          bookingDate: dateAEST(req.body.bookingDate).format(DateTimeTemplate),
          section: parseInt(req.body.section),
        }
      }
    ).exec((err, table) => {
      if (err) {
        return res.status(500).json({
          title: "An error occured!",
          error: err
        });
      }
      if (!table) {
        return res.status(500).json({
          title: "Table is not found",
          error: {
            message: "Table is not found"
          }
        });
      }
      if (table.bookings != null) {
        for (let b of table.bookings) {
          if (dateAEST(b.bookingDate).format(DateTimeTemplate) === dateAEST(req.body.bookingDate).format(DateTimeTemplate) && b.section === parseInt(req.body.section)) {
            return res.status(400).json({
              title: "The table is reserved",
              error: {
                message: "The table is reserved",
                obj: {
                  // tableId: table._id,
                  // name: table.name
                }
              }
            });
          }
        }
      }
      const newBooking = {
        user: user,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.phoneNumber,
        bookingDate: dateAEST(req.body.bookingDate),
        section: req.body.section,
        requirement: req.body.requirement
      };

      table.bookings.push(newBooking);

      table.save((err, __table) => {
        if (err) return handleError(err);
        return res.status(200).json({
          title: "Table is reserved successfully",
          obj: __table
        });
      })
    });
  });
});

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = date => {
  return momentTimezone(moment(date, DateTimeTemplate)).tz('Australia/Sydney')
}
module.exports = router;
