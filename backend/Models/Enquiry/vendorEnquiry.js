import mongoose from "mongoose";

const vendorEnquirySchema = new mongoose.Schema(
  {
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor Id is required."],
    },
    productName: {
      type: String,
      required: [true, "Product Name is required."],
      trim: true,
      minLength: [3, "Product name should have only 3 Characters."],
      maxLength: [100, "Product name should not exceeds 100 Characters."],
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxLength: [1000, "Description should not exceeds 1000 characters"],
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category2",
      required: [true, "Category is required."],
    },
    buyerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer ID is required."],
    },
    mobNumber: {
      type: String,
      required: [true, "Mobile number is required"],
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
    isViews: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const VendorEnquiry = mongoose.model("VendorEnquiry", vendorEnquirySchema);

export default VendorEnquiry;
