const mongoose = require('../db_init/init');
const Schema = mongoose.Schema;
var Table = require("./Table");

//section: 1: Breakfast 2: Lunch 3:Dinner
const bookingSchema = new Schema({
  _bookingId: Schema.Types.ObjectId,
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  bookingDate: Date,
  section: Number,
  lastName: String,
  firstName: String,
  email: String,
  phoneNumber: String,
  requirement: String,
  createDate: Date,
  confirmDeadline: Date,
  status: String,
  tableId: {type: Schema.Types.ObjectId, ref: "Table"},
});

bookingSchema.pre('delete', function (next) {
  Table.update(
    {bookings: this},
    {$pull: {bookings: this._id}},
    {multi: true}
  ).exec(next)
});

const Booking = (module.exports = mongoose.model("Booking", bookingSchema));
