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
    fromPayCycle: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("addOns", addOnsSchema);
