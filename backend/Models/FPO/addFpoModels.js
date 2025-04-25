import mongoose from "mongoose";
import slugify from "slugify";

const addfpoSchema = new mongoose.Schema(
  {
    fponame: {
      type: String,
      required: [true, "FPO name is required"],
      minlength: [3, "FPO name should have at least 3 characters"],
      maxlength: [100, "FPO name cannot exceed 100 characters"],
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    taluk: {
      type: String,
      required: [true, "Taluk is required"],
      trim: true,
      minlength: [3, "Taluk name should have at least 3 characters"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      minlength: [3, "District name should have at least 3 characters"],
    },
    underSchema: {
      type: String,
      enum: ["Cooperative", "Private", "Government"],
      default: null,
    },
    activities: {
      type: [String],
      enum: ["Farming", "Training", "MarketLinking", "Other"],
    },
    otherActivity: {
      type: String,
      default: null,
      trim: true,
    },
    personName: {
      type: String,
      required: [true, "Person's name is required"],
      trim: true,
      minlength: [3, "Person's name should have at least 3 characters"],
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
      minlength: [10, "Mobile number must be at least 10 digits long"],
      maxlength: [16, "Mobile number can be up to 16 digits long"],
    },
    cropDetails: {
      type: [
        {
          cropname: { type: String, default: null },
          quantity: { type: String, default: null },
          pricerange: { type: String, default: null },
          remarks: { type: String, default: null },
        },
      ],
      default: [],
    },
    productDetails: {
      type: [
        {
          productname: { type: String, default: null },
          quantity: { type: String, default: null },
          value: { type: String, default: null },
          remarks: { type: String, default: null },
        },
      ],
      default: [],
    },
    sellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: [true, "Seller ID is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

addfpoSchema.pre("save", async function (next) {
  try {
    this.slug = slugify(this.fponame, { lower: true, strict: true });

    const existingSlug = await this.constructor.findOne({ slug: this.slug });
    if (existingSlug) {
      this.slug = `${this.slug}-${Date.now()}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

addfpoSchema.methods.displayCropDetails = function () {
  return this.cropDetails
    .map((crop) => `${crop.cropname} (${crop.quantity})`)
    .join(", ");
};

addfpoSchema.statics.findActiveFPOs = async function () {
  return await this.find({ status: "Active" });
};

addfpoSchema.virtual("fullName").get(function () {
  return `${this.fponame} - ${this.personName}`;
});

addfpoSchema.index({ taluk: 1, district: 1 });

const AddFPOData = mongoose.model("AddFPOData", addfpoSchema);

export default AddFPOData;
