const User = require('../models/User');
const Table = require('../models/Table');
const Booking = require('../models/Booking');

Table.deleteMany().then(() => {
  console.log('Deleted Table success');

  User.deleteMany()
    .then(() => {
      console.log('Deleted users');

      Booking.deleteMany().then(() => {
        console.log('Deleted mmany');
        process.exit();
      })
    });
});


