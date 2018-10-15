const momentTimezone = require('moment-timezone');
const moment = require('moment');
const DateTemplate = "DD-MM-YYYY";
const DateTimeHourTemplate = "DD-MM-YYYY HH:mm";
const FullDateTemplate = "dddd, MMMM DD YYYY";
const BookingReserved = 1;
const BookingConfirmed = 2;
const TenMinute = "10";

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = date => {
  return momentTimezone(moment(date, DateTemplate)).tz('Australia/Sydney')
};

const getTimeAfterNMinute = (minute) => {
  let currentDate = utils.dateAEST(moment());
  currentDate.add(minute, "m");
};

module.exports = {
  dateAEST,
  BookingReserved,
  BookingConfirmed,
  DateTimeHourTemplate,
  FullDateTemplate,
  getTimeAfterNMinute,
  TenMinute
};
