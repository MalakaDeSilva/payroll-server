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
    payRange: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("designation", designationSchema);
