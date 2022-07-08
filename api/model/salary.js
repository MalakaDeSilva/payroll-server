const mongoose = require("mongoose");

const salarySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    employeeId: {
      type: String,
      required: true,
      unique: false,
    },
    payCycle: {
      type: String,
      required: true,
      unique: false,
    },
    basic: {
      type: Number,
      required: true,
    },
    fixedAllowance: {
      type: Number,
    },
    increment: {
      type: Number,
    },
    fixedCommissions: {
      type: [
        {
          commissionName: String,
          commission: Number,
        },
      ],
    },
    perUnitCommissions: {
      type: [
        {
          commissionName: String,
          commission: Number,
          units: Number,
          totalCommission: Number,
        },
      ],
    },
    bonus: {
      type: Number,
    },
    reductions: {
      type: Number,
    },
    grossSalary: {
      type: Number,
    },
    netSalary: {
      type: Number,
    },
    paid: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

salarySchema.index({ employeeId: 1, payCycle: 1 }, { unique: true });

module.exports = mongoose.model("salary", salarySchema);
