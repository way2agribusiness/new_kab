import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      minlength: [2, "Username must be at least 2 characters long."],
      maxlength: [50, "Username should not exceed 50 characters."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      validate: {
        validator: function (v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password should be at least 6 characters long."],
      select: false,
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required."],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please enter a valid 10-digit Indian mobile number.",
      },
    },
    isWhatsApp: {
      type: Boolean,
      default: false,
      required: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          return (
            !v ||
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v)
          );
        },
        message: "Invalid GST number format.",
      },
    },
    photo: {
      type: String,
      trim: true,
    },
    roleID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role reference is required."],
    },
    categoryID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category2",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    addressID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    aboutID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "About",
    },
    token: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("contactInfo").get(function () {
  return `${this.username} (${this.phone})`;
});

UserSchema.pre("save", function (next) {
  console.log(`Saving user: ${this.username}`);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
