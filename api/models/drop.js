const User = require('./User');
const Table = require('./Table');

Table.deleteMany().then(() => {
  console.log('Deleted Table success');

  User.deleteMany()
    .then(() => {
      console.log('Deleted users');
      process.exit();
    });
});



