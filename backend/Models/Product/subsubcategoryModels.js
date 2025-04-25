import mongoose from "mongoose";
const SubsubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: [2, "Name should have atleast 2 characters."],
      maxLength: [100, "Name should not exceeds 100 characters."],
      trim: true,
      lowercase: true,
    },
    subsescategoryID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subsescategory",
      },
    ],
  },
  { timestamps: true }
);

const Subsubcategory = mongoose.model("Subsubcategory", SubsubcategorySchema);

export default Subsubcategory;
