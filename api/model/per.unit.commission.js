const mongoose = require("mongoose");

const commissionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    commissionName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    payCycle: {
      type: String,
      required: true,
    },
    employeeId: {
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

module.exports = mongoose.model("perUnitCommission", commissionSchema);
