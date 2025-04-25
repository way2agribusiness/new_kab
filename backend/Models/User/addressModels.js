import mongoose from "mongoose";

const UserAddressModel = new mongoose.Schema(
  {
    address_line1: {
      type: String,
      required: [true, "Address Line 1 is required."],
      trim: true,
      minLength: [5, "Address Line 1 must be at least 5 characters."],
      maxLength: [100, "Address Line 1 should not exceed 100 characters."],
    },
    address_line2: {
      type: String,
      trim: true,
      maxLength: [100, "Address Line 2 should not exceed 100 characters."],
      default: null,
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
      maxLength: [50, "City name should not exceed 50 characters."],
    },
    state: {
      type: String,
      required: [true, "State is required."],
      trim: true,
      maxLength: [50, "State name should not exceed 50 characters."],
    },
    postal_code: {
      type: String,
      required: [true, "Postal Code is required."],
      trim: true,
      match: [
        /^[1-9][0-9]{5}$/,
        "Postal Code must be a valid 6-digit Indian PIN code.",
      ],
    },
    country: {
      type: String,
      required: [true, "Country is required."],
      trim: true,
      default: "India",
      enum: [
        "India",
        "United States",
        "Canada",
        "Russia",
        "United Kingdom",
        "Australia",
      ],
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", UserAddressModel);

export default Address;
