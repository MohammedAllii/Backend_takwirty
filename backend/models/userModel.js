const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    last_name: {
      type: String,
      required: [false, 'Please add a last name'],
      default: 'null',
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    phone: {
      type: Number,
      required: [false, 'Please add a phone'],
      default: 0,
    },
    role: {
      type: Number,
      required: [false, 'Role'],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('User', userSchema)