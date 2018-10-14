const momentTimezone = require('moment-timezone');
const moment = require('moment');
const DateTemplate = "DD-MM-YYYY";
const DateTimeHourTemplate = "DD-MM-YYYY HH:mm";
const FullDateTemplate = "dddd, MMMM DD YYYY";
const BookingReserved = "BookingReserved";
const BookingConfirmed = "BookingConfirmed";

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = date => {
  return momentTimezone(moment(date, DateTemplate)).tz('Australia/Sydney')
};

module.exports ={
  dateAEST,
  BookingReserved,
  BookingConfirmed,
  DateTimeHourTemplate,
  FullDateTemplate
};
