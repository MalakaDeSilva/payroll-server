const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    employeeId: {
      type: String,
      required: true
    },
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
    designation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["resigned", "fired", "employed", "pending"],
      default: "employed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);
