const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  NIC: {
    type: String,
    required: true,
  },
  employeeType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("employee", employeeSchema);
