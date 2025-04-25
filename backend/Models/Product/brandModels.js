import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      minlength: [3, "Brand name should have at least 3 characters"],
      maxlength: [100, "Brand name cannot exceed 100 characters"],
      trim: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

BrandSchema.virtual("formattedName").get(function () {
  return `${this.name} Brand`;
});

BrandSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
