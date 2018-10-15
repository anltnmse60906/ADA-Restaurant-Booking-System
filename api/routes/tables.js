const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');
const emailService = require("../mail/email");
const userService = require("../middlewares/user/users");
const tableService = require("../middlewares/table/tables");
const utils = require("../utils/utils");
require('dotenv').config();


//Validation the token of user
router.use("/auth", (req, res, next) => {
  jwt.verify(req.query.token, process.env.APP_SECRET || utils.AppSecrete, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        title: "Not Authenticated",
        error: err
      });
    }
    next();
  })
});

router.get("/get-bookings-of-section", (req, res) => {
  if (req.query.token) {
    userService.checkUserValidation(req, res, (err, user) => {
      tableService.getBookingListOfSection(req, res,user)
    });
  } else {
    tableService.getBookingListOfSection(req, res, null);
  }
});


/*
*
* This api is call when the user in the screen confirmed booking.
* This get the current unconfirmed booking from the user
*
* */
router.get("/auth/get-current-unconfirmed-bookings", (req, res) => {

  userService.checkUserValidation(req, res, (err, user) => {

    let inputSection = parseInt(req.query.section);
    let inputDate = utils.dateAEST(req.query.bookingDate);
    let currentDate = utils.dateAEST(moment());

    Booking.find({
      user: {$eq: user._id},
      section: inputSection,
      bookingDate: {$eq: (inputDate).toISOString()},
      status: utils.BookingReserved,
      confirmDeadline: {$gt: currentDate.toISOString()}
    }).populate("tableId")
      .exec((err, tables) => {
        if (err) {
          return res.status(500).json({
            title: "An error occured!",
            error: err
          });
        }
        return res.status(200).json({
          title: "User is not found",
          obj: {
            reservedTable: tables,
            user: user
          }
        });
      });
  });
});


/*
* Get history booking. It includes paging function
*
* */
router.get("/auth/users-booking-history-list", (req, res) => {
  userService.checkUserValidation(req, res, (err, user) => {

    let itemsPerPage = 10;
    let start = (req.query.p - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    //Get all the bookings which are confirmed by the current user
    //The result of the query is the booking is grouped by
    // section - bookingDate - createDate
    Booking.aggregate(
      [
        {
          "$match":
            {
              user: {$eq: user._id},
              status: utils.BookingConfirmed,
            }
        },
        {
          "$group": {
            "_id": {
              section: "$section",
              bookingDate: "$bookingDate",
              createDate: "$createDate"
            },
          }
        }
      ]
    ).exec((err, bookingsByCreateDate) => {
      if (err) {
        return res.status(500).json({
          title: "An error occurred!",
          error: err
        });
      }
      let count = 0;
      let bookingsGroupByCreateDate = [];

      // Get all the bookings in booking groups
      for (let b of bookingsByCreateDate) {

        let booking = b._id;

        Booking.find({
          user: {$eq: user._id},
          status: utils.BookingConfirmed,
          bookingDate: booking.bookingDate,
          section: booking.section,
          createDate: {$eq: utils.dateAEST(booking.createDate).toISOString()}
        },"bookingDate confirmDeadline  createDate  createDate  firstName  lastName phoneNumber requirement section _id")
          .populate("tableId","_id capacity name isSmoking location")
          .exec((err, groupBookings) => {
            count++;
            bookingsGroupByCreateDate.push(groupBookings);

            if (count === bookingsByCreateDate.length) {

              //Total of booking groups
              let total = bookingsGroupByCreateDate.length;

              // Get list of booking for the current page
              bookingsGroupByCreateDate = bookingsGroupByCreateDate.slice(start, end);

              return res.status(200).json({
                title: "Get booking history successfully",
                obj: {
                  total: total,
                  page: req.query.p,
                  bookings: bookingsGroupByCreateDate
                }
              });
            }
          });
      }
    });
  });
});

/*
* This API is used for reserved the tables
*
*
* */
router.post("/auth/reserve-table", (req, res) => {

  userService.checkUserValidation(req, res, (err, user) => {

    let inputSection = parseInt(req.body.section);
    let inputDate = utils.dateAEST(req.body.bookingDate);
    let currentDate = utils.dateAEST(moment());

    tableService.findTableById(req, res, req.body.bookingTable._id, (table) => {


      // Get get booking for specific table on section on date
      Booking.find({
        tableId: {$eq: ObjectId(table._id)},
        section: inputSection,
        bookingDate: {$eq: (inputDate).toISOString()},
      }).populate("user").populate("tableId")
        .exec((err, bookings) => {
          if (err) {
            return res.status(500).json({
              title: "An error occurred!",
              error: err
            });
          }
          // if there is no booking, the new booking will be added
          if (bookings.length === 0) {
            tableService.addNewBooking(req, res, table,user);
          } else {

            for (let booking of bookings) {
              // In this case after the user use another browser to access to the homepage
              // An this user keeps booking for other tables.
              // In this case the "confirmDeadline" is extend for existing bookings.
              // The old unconfirmed bookings will be update to have the same "confirmedDeadline"
              // with the new ones
              if (currentDate.isSameOrAfter(utils.dateAEST(booking.confirmDeadline)) || (booking.user._id.equals(user._id))) {
                let currentDate = utils.getTimeAfterNMinute(utils.TenMinute);

                booking.confirmDeadline = currentDate;
                booking.save(function (err, updatedBooking) {
                  if (err) {
                    return res.status(500).json({
                      title: "An error occurred!",
                      error: err
                    });
                  }
                  return res.status(200).json({
                    title: "Table is reserved successfully",
                    obj: {
                      success: true,
                      data: updatedBooking
                    }
                  });
                });
              } else {
                // Because in the front-end this one is called in the for loop
                // If this table is reserved by the other user, It returns the success = "false"
                // This is used for showing the message in front-end

                return res.status(200).json({
                  title: "The table is reserved by other",
                  obj: {
                    success: false,
                    data: booking
                  }
                });
              }
            }
          }
        });
    });
  });
});


router.post("/auth/confirm-reserved-bookings", (req, res) => {

  userService.checkUserValidation(req, res, (err, user) => {

    let reservedBookings = req.body.reservedBookings;
    let createDate = utils.dateAEST(moment());
    let count = 0;
    let isFailed = false;
    let tableNumber = [];
    let totalPeople = 0;

    // The list of reserved bookings is confirmed
    // If the status updating for a booking is failed, it will return the total fail
    // for the front-end
    for (let reservedBooking of reservedBookings) {

      tableService.findBookingById(req, res, reservedBooking.bookingId, (booking) => {

        let currentDate = utils.getTimeAfterNMinute(utils.TenMinute);

        // Check the reserved booking is not expired
        // and it has to be belong to the current user
        if ((utils.dateAEST(booking.confirmDeadline).isSameOrBefore(currentDate))
          && (booking.user._id.equals(user._id))) {

          // update information  for  the booking for
          booking.lastName = reservedBooking.lastName;
          booking.firstName = reservedBooking.firstName;
          booking.phoneNumber = reservedBooking.phoneNumber;
          booking.email = reservedBooking.email;
          booking.requirement = reservedBooking.requirement;
          booking.status = utils.BookingConfirmed;
          booking.createDate = createDate;

          tableNumber.push(booking.tableId.name);
          totalPeople += booking.tableId.capacity;

          // prepare the information need for the content of  e-mail
          let message = {
            receiver: booking.email,
            lastName: booking.lastName,
            firstName: booking.firstName,
            phoneNumber: booking.phoneNumber,
            requirement: booking.requirement,
            createDate: utils.dateAEST(booking.createDate).format(utils.DateTimeHourTemplate),
            section: getSection(booking.section),
            bookingDate: utils.dateAEST(booking.bookingDate).format(utils.FullDateTemplate),
            tables: tableNumber.toString(),
            totalPeople: totalPeople
          };

          booking.save(function (err, updatedBooking) {
            count++;
            if (err) {
              isFailed = true;
            }
            if (count === reservedBookings.length) {
              if (!isFailed) {

                // Sending an email, if the email gets error when sending email
                // it will return sending email error flag to the front-end
                emailService.sendEmails(message, (error) => {
                  return res.status(200).json({
                    title: "Booking is confirmed successfully",
                    obj: {
                      success: true,
                      data: updatedBooking,
                      email: error
                    }
                  });
                }, (success) => {
                  return res.status(200).json({
                    title: "Booking is confirmed successfully",
                    obj: {
                      success: true,
                      data: updatedBooking,
                      email: success
                    }
                  });
                });
              } else {
                return res.status(200).json({
                  title: "Booking is confirmed failed",
                  obj: {
                    success: false,
                    data: booking,
                    email: error
                  }
                });
              }
            }
          });
        } else {
          isFailed = true;
          count++
        }
      });
    }
  });
});

// Remove reserved booking
router.post("/auth/delete-reserved-booking", (req, res) => {
  userService.checkUserValidation(req, res, (err, user) => {

    Booking.findOneAndDelete({
      _id: req.body.bookingId,
      user: {$eq: user._id},
    }, (err) => {
      if (err) {
        return res.status(500).json({
          title: "An error occurred!",
          error: err
        });
      }
      return res.status(200).json({
        title: "Reserved table is delete successfully",
        obj: {
          success: true,
        }
      });
    })
  });
});


const getSection = (selectedSection) => {
  let s = parseInt(selectedSection);
  if (s === 1) {
    return "Breakfast";
  } else if (s === 2) {
    return "Lunch";
  } else if (s === 3) {
    return "Dinner";
  }
  return ""
}
module.exports = router;
