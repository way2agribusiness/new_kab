import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, "Category name should have at least 3 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
      trim: true,
      unique: true,
      index: true,
    },
    subcategoriesID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ subcategoriesID: 1 });

CategorySchema.virtual("subcategoriesCount").get(function () {
  return this.subcategoriesID.length;
});

CategorySchema.virtual("formattedName").get(function () {
  return `Category: ${this.name.toUpperCase()}`;
});

CategorySchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

const Category2 = mongoose.model("Category2", CategorySchema);

export default Category2;
