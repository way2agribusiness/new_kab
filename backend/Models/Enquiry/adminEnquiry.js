import mongoose from "mongoose";

const AdminEnquirySchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minLength: [2, "Product name atleast have 2 Characters."],
      maxLength: [100, "Product name should not exceeds 100 Characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: [10, "Description should have atleast 10 Characters."],
      maxLength: [1000, "Description should not exceeds 1000 Characters."],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer reference is required"],
    },
    buyerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer ID is required"],
    },
    views: [
      {
        vendorID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AdminEnquiry = mongoose.model("AdminEnquiry", AdminEnquirySchema);

export default AdminEnquiry;
