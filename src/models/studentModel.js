const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("student", studentSchema);
