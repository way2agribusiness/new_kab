import mongoose from "mongoose";

const addressFPOSchema = new mongoose.Schema(
  {
    address_line1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
      minlength: [5, "Address line 1 must have at least 5 characters"],
      maxlength: [200, "Address line 1 cannot exceed 200 characters"],
    },
    address_line2: {
      type: String,
      trim: true,
      maxlength: [200, "Address line 2 cannot exceed 200 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [3, "City name must have at least 3 characters"],
      maxlength: [100, "City name cannot exceed 100 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [3, "State name must have at least 3 characters"],
      maxlength: [100, "State name cannot exceed 100 characters"],
    },
    postal_code: {
      type: String,
      required: [true, "Postal code is required"],
      match: [/^\d{6}$/, "Please enter a valid 6-digit postal code"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      maxlength: [100, "Country name cannot exceed 100 characters"],
    },
  },
  { timestamps: true }
);

addressFPOSchema.index({ city: 1, state: 1, postal_code: 1 });

addressFPOSchema.pre("save", function (next) {
  if (this.postal_code) {
    this.postal_code = this.postal_code.trim().toUpperCase();
  }
  next();
});

addressFPOSchema.virtual("fullAddress").get(function () {
  return `${
    this.address_line1
  }, ${this.address_line2 ? this.address_line2 + ", " : ""}${this.city}, ${this.state}, ${this.country} - ${this.postal_code}`;
});

const AddressFPO = mongoose.model("AddressFPO", addressFPOSchema);

export default AddressFPO;
