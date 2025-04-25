import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      required: [true, "Rating value is required"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer value",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description should have atleast 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
