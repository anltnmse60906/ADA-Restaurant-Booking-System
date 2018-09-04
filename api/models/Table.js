const mongoose = require('./init');
const Schema = mongoose.Schema;

//section: 1: Breakfast 2: Lunch 3:Dinner
const bookingSchema = new Schema({
  _bookingId: Schema.Types.ObjectId,
  user: {type: Schema.ObjectId, ref: 'User'},
  bookingDate: Date,
  section: Number,
  lastName: String,
  firstName: String,
  email: String,
  phoneNumber: String,
  requirement: String,
  tableId: {type: Schema.ObjectId, ref: "Table"},
});

const tableSchema = new Schema({
  name: {type: String, index: true, required: true},
  capacity: Number,
  location: {required: true, type: String},
  isSmoking: {type: Boolean, default: false},
  bookings: [bookingSchema]
});

const Table = (module.exports = mongoose.model("Table", tableSchema));
