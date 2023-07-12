import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trime: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trime: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    options: {
      type: [String],
      required: [true, "Options is required"],
    },
    image: {
      public_id: {
        type: String,
        required: [true, "Image is required"],
      },
      url: {
        type: String,
        required: [true, "Image is required"],
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Prodcut", productSchema);

export default Product;
