import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Prodcut",
        },
        title: {
          type: String,
          require: true,
        },
        price: {
          type: Number,
          require: true,
        },
        options: {
          type: [String],
          default: null,
        },
        image: {
          type: String,
          require: true,
        },
        qty: {
          type: Number,
          require: true,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],
    amountPaid: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
