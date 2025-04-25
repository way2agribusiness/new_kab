import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minLength: [2, "Name should have atleast 2 characters."],
      maxLength: [100, "Name should not exceeds 100 charcaters."],
      lowercase: true,
    },
    subsubcategoriesID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subsubcategory",
      },
    ],
  },
  { timestamps: true }
);

SubcategorySchema.virtual("subsubcategoryCount").get(function () {
  return this.subsubcategoriesID?.length || 0;
});

SubcategorySchema.set("toJSON", { virtuals: true });
SubcategorySchema.set("toObject", { virtuals: true });

SubcategorySchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

const Subcategory = mongoose.model("Subcategory", SubcategorySchema);

export default Subcategory;
