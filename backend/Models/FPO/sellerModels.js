import mongoose from "mongoose";

const { Schema } = mongoose;

const sellerSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    addressID: {
      type: Schema.Types.ObjectId,
      ref: "AddressFPO",
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sellerSchema.virtual("displayInfo").get(function () {
  return `${this.username} (${this.email || "No email"})`;
});

sellerSchema.pre("save", function (next) {
  if (this.phone) {
    this.phone = this.phone.toString().trim();
  }
  next();
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
