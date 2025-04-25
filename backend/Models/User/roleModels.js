import mongoose from "mongoose";

const roleEnum = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required."],
      enum: {
        values: ["Buyer", "Vendor", "Admin"],
        message: "Role must be one of: Buyer, Vendor, Admin",
      },
      trim: true,
      lowercase: true,
    },
    categoryID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        validate: {
          validator: function (v) {
            return Array.isArray(v) && v.length > 0;
          },
          message: "At least one category must be linked with the role.",
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

roleEnum.virtual("categoryCount").get(function () {
  return this.categoryID?.length || 0;
});

roleEnum.pre("save", function (next) {
  console.log(`A role "${this.name}" is about to be saved.`);
  next();
});

const Role = mongoose.model("Role", roleEnum);

export default Role;
