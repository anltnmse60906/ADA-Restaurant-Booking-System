var express = require("express");
var router = express.Router();
var Table = require("../models/Table");
var User = require("../models/User");
var Booking = require("../models/Booking");
var jwt = require("jsonwebtoken");
var ObjectId = require('mongoose').Types.ObjectId;
const momentTimezone = require('moment-timezone');
const moment = require('moment');


const DateTimeTemplate = "DD-MM-YYYY";
const BookingReserved = "BookingReserved";
const BookingConfirmed = "BookingConfirmed";

/*
* section
* get date
*
* */
router.get("", (req, res) => {

  let inputSection = parseInt(req.query.section);
  let inputDate = dateAEST(req.query.bookingDate);
  let currentDate = dateAEST(moment());

  if (req.query.token) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, (err, user) => {
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
      //Find the table
      Booking.find({
        section: inputSection,
        bookingDate: {$eq: (inputDate).toISOString()},
      }).populate("tableId")
        .exec((err, bookings) => {
          if (err) {
            return res.status(500).json({
              title: "An error occured!",
              error: err
            });
          }
          let reservedTables = [];
          let reservedTablesByUserId = [];

          if (bookings.length === 0) {
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
              return res.status(200).json({
                title: "Tables is returned successfully",
                obj: {
                  tableList: tables,
                  reservedTables: reservedTables,
                  reservedTablesByUserId: reservedTablesByUserId
                }
              });
            });

          } else {
            let expiredConfirmBookings = [];

            for (let booking of bookings) {
              if (booking.status === BookingReserved) {
                //Check  the booking which is comfirmed
                if (currentDate.isSameOrBefore(booking.confirmDeadline)) {
                  // Add to reserved list
                  reservedTables.push(booking);
                  if (booking.user.equals(user._id)) {
                    reservedTablesByUserId.push(booking);
                  }
                } else {
                  // Delete the booking
                  expiredConfirmBookings.push(booking);
                }
              } else {
                reservedTables.push(booking);
              }
            }
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
              //Remove Unconfirmed bookings
              if (expiredConfirmBookings.length > 0) {
                let deleteTotal = expiredConfirmBookings.length;
                let count = 0;

                for (let unconfirmed of expiredConfirmBookings) {
                  Booking.findByIdAndDelete(unconfirmed._id, (err) => {
                    if (err) {
                      console.log(err);
                    }
                    count++;
                    if (count === deleteTotal) {
                      return res.status(200).json({
                        title: "Tables is returned successfully",
                        obj: {
                          tableList: tables,
                          reservedTables: reservedTables,
                          reservedTablesByUserId: reservedTablesByUserId
                        }
                      });
                    }
                  })
                }
              } else {
                return res.status(200).json({
                  title: "Tables is returned successfully",
                  obj: {
                    tableList: tables,
                    reservedTables: reservedTables,
                    reservedTablesByUserId: reservedTablesByUserId
                  }
                });
              }
            });
          }
        });
    });
  } else {
    return getTableWithoutToken(req, res);
  }
});

getTableWithoutToken = (req, res) => {
  let inputSection = parseInt(req.query.section);
  let inputDate = dateAEST(req.query.bookingDate);
  let currentDate = dateAEST(moment());
  //Find the table
  Booking.find({
    section: inputSection,
    bookingDate: {$eq: (inputDate).toISOString()},
  }).populate("tableId")
    .exec((err, bookings) => {
      if (err) {
        return res.status(500).json({
          title: "An error occured!",
          error: err
        });
      }
      let reservedTables = [];

      if (bookings.length === 0) {
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
          return res.status(200).json({
            title: "Tables is returned successfully",
            obj: {
              tableList: tables,
              reservedTables: reservedTables
            }
          });
        });

      } else {
        let expiredConfirmBookings = [];

        for (let booking of bookings) {
          if (booking.status === BookingReserved) {
            //Check  the booking which is comfirmed
            if (currentDate.isSameOrBefore(booking.confirmDeadline)) {
              // Add to reserved list
              reservedTables.push(booking);
            } else {
              // Delete the booking
              expiredConfirmBookings.push(booking);
            }
          } else {
            reservedTables.push(booking);
          }
        }
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
          //Remove Unconfirmed bookings
          if (expiredConfirmBookings.length > 0) {
            let deleteTotal = expiredConfirmBookings.length;
            let count = 0;

            for (let unconfirmed of expiredConfirmBookings) {
              Booking.findByIdAndDelete(unconfirmed._id, (err) => {
                if (err) {
                  console.log(err);
                }
                count++;
                if (count === deleteTotal) {
                  return res.status(200).json({
                    title: "Tables is returned successfully",
                    obj: {
                      tableList: tables,
                      reservedTables: reservedTables
                    }
                  });
                }
              })
            }
          } else {
            return res.status(200).json({
              title: "Tables is returned successfully",
              obj: {
                tableList: tables,
                reservedTables: reservedTables
              }
            });
          }
        });
      }
    });
}

/*
* List of table[]
* Section
* Date
* Requirement
* UserId
*
*
* */
router.use("/auth", (req, res, next) => {
  jwt.verify(req.query.token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({
        title: "Not Authenticated",
        error: err
      });
    }
    next();
  })
});

router.get("/auth/users", (req, res) => {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, (err, user) => {
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

    let inputSection = parseInt(req.query.section);
    let inputDate = dateAEST(req.query.bookingDate);
    let currentDate = dateAEST(moment());

    Booking.find({
      user: {$eq: user._id},
      section: inputSection,
      bookingDate: {$eq: (inputDate).toISOString()},
      status: BookingReserved,
      confirmDeadline: {$gt: currentDate.toISOString()}
      // }).populate("user").populate("tableId")
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


router.post("/auth/reserve-table", (req, res) => {
  var decoded = jwt.decode(req.query.token);

  User.findById(decoded.user._id, (err, user) => {
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

    let inputSection = parseInt(req.body.section);
    let inputDate = dateAEST(req.body.bookingDate);
    let currentDate = dateAEST(moment());

    Table.findById(req.body.bookingTable._id, (err, table) => {
      if (err) {
        return res.status(500).json({
          title: "An error occured!",
          error: err
        });
      }
      if (!user) {
        return res.status(500).json({
          title: "Table is not found",
          error: {
            message: "Table is not found"
          }
        });
      }

      Booking.find({
        tableId: {$eq: ObjectId(req.body.bookingTable._id)},
        section: inputSection,
        bookingDate: {$eq: (inputDate).toISOString()},
      }).populate("user").populate("tableId")
        .exec((err, bookings) => {
          if (err) {
            return res.status(500).json({
              title: "An error occured!",
              error: err
            });
          }

          if (bookings.length === 0) {
            let currentDate = dateAEST(moment());
            currentDate.add("10", "m");
            const newBooking = new Booking({
              user: user,
              lastName: req.body.lastName,
              firstName: req.body.firstName,
              phoneNumber: req.body.phoneNumber,
              email: req.body.phoneNumber,
              bookingDate: dateAEST(req.body.bookingDate),
              section: req.body.section,
              requirement: req.body.requirement,
              confirmDeadline: currentDate,
              status: BookingReserved,
              tableId: req.body.bookingTable._id
            });

            newBooking.save((err, newBooking) => {

              if (err) return handleError(err);
              // return res.status(200).json({
              //   title: "Table is reserved successfully",
              //   obj: {
              //     success: true,
              //     data: newBooking
              //   }
              // });


              table.bookings.push(newBooking);
              table.save((err, __table) => {
                if (err) {
                  return res.status(500).json({
                    title: "An error occured!",
                    error: err
                  });
                }
                return res.status(200).json({
                  title: "Table is reserved successfully",
                  obj: {
                    success: true,
                    data: newBooking
                  }
                });
              });
            });
          } else {
            for (let booking of bookings) {
              if (currentDate.isSameOrAfter(dateAEST(booking.confirmDeadline)) || (booking.user._id.equals(user._id))) {
                let currentDate = dateAEST(moment());
                currentDate.add("10", "m");

                booking.userId = user._id;
                booking.confirmDeadline = currentDate;
                booking.save(function (err, updatedBooking) {
                  if (err) {
                    return res.status(500).json({
                      title: "An error occured!",
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
                return res.status(200).json({
                  title: "The table is reserved",
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


router.post("/auth/confirm-reserved-tables", (req, res) => {
  var decoded = jwt.decode(req.query.token);

  User.findById(decoded.user._id, (err, user) => {
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
    Booking.findById(req.body.bookingId)
      .exec((err, booking) => {
        if (err) {
          return res.status(500).json({
            title: "An error occured!",
            error: err
          });
        }
        if (!booking) {
          return res.status(500).json({
            title: "Booking is not found",
            error: err
          });
        }
        let currentDate = dateAEST(moment());
        currentDate.add("10", "m");

        if (currentDate.isSameOrBefore(dateAEST(booking.confirmDeadline)) || (booking.user._id.equals(user._id))) {

          booking.lastName = req.body.lastName;
          booking.firstName = req.body.firstName;
          booking.phoneNumber = req.body.phoneNumber;
          booking.email = req.body.phoneNumber;
          booking.requirement = req.body.requirement;
          booking.status = BookingConfirmed;

          booking.save(function (err, updatedBooking) {
            if (err) {
              return res.status(500).json({
                title: "An error occured!",
                error: err
              });
            }
            return res.status(200).json({
              title: "Booking is confirmed successfully",
              obj: {
                success: true,
                data: updatedBooking
              }
            });
          });
        } else {
          return res.status(200).json({
            title: "The table reservation time is expired",
            obj: {
              success: false,
              data: booking
            }
          });
        }
      });
  });
});


router.post("/auth/delete-reserved-table", (req, res) => {
  var decoded = jwt.decode(req.query.token);

  User.findById(decoded.user._id, (err, user) => {
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
    Booking.findOneAndDelete({_id: req.body.bookingId}, (err) => {
      if (err) {
        return res.status(500).json({
          title: "An error occured!",
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
;

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = date => {
  return momentTimezone(moment(date, DateTimeTemplate)).tz('Australia/Sydney')
};
const checkMinutesExpired = (date, minutes) => {
  let currentDate = dateAEST(moment());
  currentDate.add(minutes, "m");
  return date.isBefore(currentDate);
}
module.exports = router;
