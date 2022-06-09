const mongoose = require("mongoose");

const addOnsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    employeeId: {
      type: String,
      required: true,
    },
    increment: {
      type: Number,
    },
    fixedAllowance: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("addOns", addOnsSchema);
