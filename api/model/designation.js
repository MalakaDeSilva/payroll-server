const mongoose = require("mongoose");

const designationSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    designationCode: {
      type: String,
      required: true,
    },
    designationName: {
      type: String,
      required: true,
    },
    salaryRange: {
      type: {
        from: Number,
        to: Number,
      },
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("designation", designationSchema);
