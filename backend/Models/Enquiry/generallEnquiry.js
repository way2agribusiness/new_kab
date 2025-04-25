import mongoose from "mongoose";

const generalEnquirySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      minLength: [3, "Username must have 3 Characters."],
      maxLength: [50, "Username should not exceed 50 Characters."],
    },
    mobNumber: {
      type: String,
      required: [true, "Mobile Number is required."],
      validate: {
        validator: function (v) {
          const indiaPattern = /^[6-9]\d{9}$/;
          const internationalPattern = /^\+?[1-9]\d{1,14}$/;
          return indiaPattern.test(v) || internationalPattern.test(v);
        },
        message:
          "Please enter a valid mobile number (Indian or international format)",
      },
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category2",
      required: [true, "Category is required."],
    },
    productName: {
      type: String,
      default: null,
      trim: true,
      maxLength: [100, "Product name should not exceed 100 Characters."],
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxLength: [1000, "Description must not exceed 1000 Characters."],
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
      maxLength: [100, "City must be under 100 characters."],
    },
    taluk: {
      type: String,
      required: [true, "Taluk is required."],
      trim: true,
      maxLength: [100, "Taluk must be under 100 characters."],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isViews: [
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

const GeneralEnquiry = mongoose.model("GeneralEnquiry", generalEnquirySchema);

export default GeneralEnquiry;
