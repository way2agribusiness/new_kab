import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      minLength: [2, "Title should atleast have 2 characters."],
      maxLength: [100, "Title should not exceeds 100 characters."],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      minLength: [10, "Description should have atleast 10 characters."],
      maxLength: [1000, "Description should not exceeds 1000 characters."],
    },
    images: {
      type: String,
    },
    price: {
      type: String,
      required: [true, "Price is required."],
    },
    cutprice: {
      type: String,
      required: [true, "Cutprice is required."],
    },
    quantity: {
      type: String,
      default: null,
    },
    instock: {
      type: Number,
      default: null,
    },
    specifications: [
      {
        title: {
          type: String,
          required: [true, "Title is required"],
        },
        desc: {
          type: String,
          required: [true, "Desc is required."],
        },
      },
    ],
    warranty: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    brandID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category2",
    },
    subcategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    subsubcategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsubcategory",
    },
    subsescategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsescategory",
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    nearby: {
      type: String,
    },
    postal_code: {
      type: Number,
    },
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
