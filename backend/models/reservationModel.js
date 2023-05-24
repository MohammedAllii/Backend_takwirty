const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Terrain',
  },
  date: {
    type: String,
    required: true,
  },
  heure: {
    type: Number,
    required: true,
  },
  etat: {
    type: Number,
    required: [false],
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);