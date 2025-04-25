import mongoose from "mongoose";

const ProductTagSchema = new mongoose.Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    tagID: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: [true, "Tag ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ProductTagSchema.index({ productID: 1, tagID: 1 });

ProductTagSchema.virtual("productTitle", {
  ref: "Product",
  localField: "productID",
  foreignField: "_id",
  justOne: true,
  select: "title",
});

ProductTagSchema.virtual("tagName", {
  ref: "Tag",
  localField: "tagID",
  foreignField: "_id",
  justOne: true,
  select: "name",
});

ProductTagSchema.pre("save", function (next) {
  if (!this.productID || !this.tagID) {
    return next(new Error("ProductID and TagID must be present"));
  }
  next();
});

ProductTagSchema.post("remove", function (doc) {
  console.log(
    `ProductTag with ProductID ${doc.productID} and TagID ${doc.tagID} was removed.`
  );
});

const ProductTag = mongoose.model("ProductTag", ProductTagSchema);

export default ProductTag;
