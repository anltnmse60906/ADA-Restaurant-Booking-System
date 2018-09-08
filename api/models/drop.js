const User = require('./User');
const Table = require('./Table');
const Booking = require('./Booking');

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


