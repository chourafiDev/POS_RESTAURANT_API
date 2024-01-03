import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc Get orders
// @route GET api/orders
// @access Privet
const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).select("-__v -updatedAt").populate({
    path: "customerId",
    select: "name email phone -_id",
  });

  res.status(200).json(orders);
});

export { getOrders };
