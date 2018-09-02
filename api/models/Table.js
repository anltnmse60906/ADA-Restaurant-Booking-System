const mongoose = require('./init');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  _bookingId: Schema.Types.ObjectId,
  user: {type: Schema.ObjectId, ref: 'User'},
  bookingStart: Date,
  startHour: Number,
  duration: Number,
  isSmoking: {type: Boolean, default: false},
  tableId: {type: Schema.ObjectId, ref: "Table"}
});

const tableSchema = new Schema({
  name: {type: String, index: true, required: true},
  capacity: Number,
  location: {required: true, type: String},
  bookings: [bookingSchema]
});

const Table = (module.exports = mongoose.model("Table", tableSchema));
