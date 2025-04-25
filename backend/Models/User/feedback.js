import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minLength: [10, "Description should atleast have 10 characters."],
      maxLength: [1000, "Feedback should not exceed 1000 characters."],
    },
    serviceRating: {
      type: Number,
      required: [true, "Service rating is required."],
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating must not exceed 5."],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer value.",
      },
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required."],
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
