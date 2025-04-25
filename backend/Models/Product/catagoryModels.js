import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
      trim: true,
      unique: true,
      index: true,
    },
    subcategoriesID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.virtual("formattedName").get(function () {
  return `${this.name} Category`;
});

CategorySchema.index({ name: 1 });

CategorySchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

CategorySchema.post("save", async function (doc) {
  const existingCategory = await this.constructor.findOne({ name: doc.name });
  if (existingCategory) {
    throw new Error("Category with this name already exists.");
  }
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
