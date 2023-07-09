import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    icon: {
      public_id: {
        type: String,
        required: [true, "Icon is required"],
      },
      url: {
        type: String,
        required: [true, "Icon is required"],
      },
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
