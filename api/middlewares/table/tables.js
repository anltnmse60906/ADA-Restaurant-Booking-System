const Table = require("../../models/Table");
const Booking = require("../../models/Booking");
const utils = require("../../utils/utils");
const moment = require('moment');


const getBookingForAllTables = (req, res, next) => {

  Table.find({}).exec((err, tables) => {
    if (err) {
      return res.status(500).json({
        title: "An error occurred!",
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
    next(tables);
  });
};

const findTableById = (req, res, tableId, next) => {
  Table.findById(tableId, (err, table) => {
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
    next(table);
  });
};

const findBookingById = (req, res, bookingId, next) => {

  Booking.findById(bookingId).populate("tableId")
    .exec((err, booking) => {
      if (err) {
        return res.status(500).json({
          title: "An error occurred!",
          error: err
        });
      }
      if (!booking) {
        return res.status(500).json({
          title: "Booking is not found",
          error: {
            message: "Booking is not found"
          }
        });
      }
      next(booking);
    });
};


const deleteUnconfirmedBooking = (expiredConfirmBookings, next) => {
  let deleteTotal = expiredConfirmBookings.length;
  let count = 0;

  for (let unconfirmed of expiredConfirmBookings) {
    Booking.findByIdAndDelete(unconfirmed._id, (err) => {
      if (err) {
        console.log(err);
      }
      count++;
      if (count === deleteTotal) {
        next();
      }
    })
  }
};

const getBookingListOfTablesWithoutToken = (req, res) => {

  let inputSection = parseInt(req.query.section);
  let inputDate = utils.dateAEST(req.query.bookingDate);
  let currentDate = utils.dateAEST(moment());

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

        //Get the list of table because there is no booking at this current section
        getBookingForAllTables(req, res, (tables) => {
          return res.status(200).json({
            title: "Tables is returned successfully",
            obj: {
              tableList: tables,
              reservedTables: [],
              reservedTablesByUserId: []
            }
          });
        });

      } else {
        let expiredConfirmBookings = [];

        for (let booking of bookings) {
          if (booking.status === utils.BookingReserved) {
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

        getBookingForAllTables(req, res, (tables) => {

          //Remove Unconfirmed bookings
          if (expiredConfirmBookings.length > 0) {


            deleteUnconfirmedBooking(expiredConfirmBookings, () => {

              return res.status(200).json({
                title: "Tables is returned successfully",
                obj: {
                  tableList: tables,
                  reservedTables: reservedTables
                }
              });
            });
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
};

const addNewBooking = (req, res, table, user) => {
  let currentDate = utils.dateAEST(moment());
  currentDate.add("10", "m");
  const newBooking = new Booking({
    user: user,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.phoneNumber,
    bookingDate: utils.dateAEST(req.body.bookingDate),
    section: req.body.section,
    requirement: req.body.requirement,
    confirmDeadline: currentDate,
    status: utils.BookingReserved,
    tableId: req.body.bookingTable._id
  });

  newBooking.save((err, newBooking) => {

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
};

module.exports = {
  getBookingForAllTables,
  deleteUnconfirmedBooking,
  getBookingListOfTablesWithoutToken,
  findTableById,
  addNewBooking,
  findBookingById
};
