const mongoose = require('../db_init/init');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  name: {type: String, index: true, required: true},
  capacity: Number,
  location: {required: true, type: String},
  isSmoking: {type: Boolean, default: false},
  bookings: [{type: Schema.Types.ObjectId, ref: 'Booking'}]
});
const Table = (module.exports = mongoose.model("Table", tableSchema));
