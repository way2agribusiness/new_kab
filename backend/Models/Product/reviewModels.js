import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    rating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
      required: [true, "Rating reference is required"],
      validate: {
        validator: async function (value) {
          const rating = await mongoose.model("Rating").findById(value);
          if (!rating) {
            throw new Error("Rating does not exist.");
          }
        },
        message: "Rating reference is invalid",
      },
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [5, "Comment must have at least 5 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ userID: 1, productID: 1 }, { unique: true });

ReviewSchema.virtual("formattedComment").get(function () {
  return `${this.comment.slice(0, 100)}...`;
});

ReviewSchema.pre("save", function (next) {
  if (this.comment) {
    this.comment = this.comment.trim();
  }
  next();
});

ReviewSchema.post("save", function (doc) {
  console.log(`New review saved for product ${doc.productID}: ${doc.comment}`);
});

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
