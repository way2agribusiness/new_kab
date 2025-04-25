import mongoose from "mongoose";

const SubsescategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: [2, "Name should have atleast 2 characters."],
      maxLength: [50, "Name should have not more than 50 characters."],
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);
SubsescategorySchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});
SubsescategorySchema.set("toJSON", { virtuals: true });
SubsescategorySchema.set("toObject", { virtuals: true });
const Subsescategory = mongoose.model("Subsescategory", SubsescategorySchema);

export default Subsescategory;
