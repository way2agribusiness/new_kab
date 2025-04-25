import mongoose from "mongoose";

const addEnquirySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: [3, "Username must have atleast 3 characters."],
      maxLength: [60, "Username must not be above 50 characters."],
    },

    mobNumber: {
      type: String,
      required: [true, "Mobile Number is required"],
      validate: {
        validator: function (v) {
          // Indian
          const indiaPattern = /^[6-9]\d{9}$/;
          // International
          const internationalPattern = /^\+?[1-9]\d{1,14}$/;

          return indiaPattern.test(v) || internationalPattern.test(v);
        },
        message:
          "Please enter a valid mobile number (Indian or international format)",
      },
      minlength: [10, "Mobile number must be at least 10 digits long"],
      maxlength: [16, "Mobile number can be up to 16 digits long"],
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category2",
      required: [true, "Cateogory is required"],
    },
    productName: {
      type: String,
      default: null,
      trim: true,
      maxLength: [100, "ProductName should not exceeds 100 Characters"],
    },
    description: {
      type: String,
      default: null,
      trim: true,
      minlength: [10, "Description should have atleast 10 Characters."],
      maxLength: [1000, "Descrition should not exceeds 1000 Characters."],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minLength: [2, "City should have atleast 2 Characters."],
      maxLength: [100, "City should not exceeds 100 Characters"],
    },
    taluk: {
      type: String,
      required: [true, "Taluk is required"],
      trim: true,
      minLength: [2, "Taluk should have atleast 2 Characters"],
      maxLength: [100, "Taluk should not exceeds 100 Characters"],
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
    isRemoved: [
      {
        vendorID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        removedAt: {
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

const AddEnquiry = mongoose.model("AddEnquiry", addEnquirySchema);

export default AddEnquiry;
