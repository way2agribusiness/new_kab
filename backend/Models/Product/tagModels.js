import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      unique: true,
      minLength: [2, "Name should have at least 2 characters"],
      maxLength: [100, "Name should not exceed 100 characters"],
    },
  },
  { timestamps: true }
);

TagSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

TagSchema.set("toJSON", { virtuals: true });
TagSchema.set("toObject", { virtuals: true });

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
