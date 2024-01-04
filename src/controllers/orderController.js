import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc Get orders
// @route GET api/orders
// @access Privet
const getOrders = asyncHandler(async (req, res) => {
  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";

  let generateQuery = {};

  if (startDate != "" && endDate != "") {
    const endDateFull = new Date(endDate);
    endDateFull.setHours(23, 59, 59, 999); // Set to the end of the day

    generateQuery = {
      createdAt: { $gte: new Date(startDate), $lte: endDateFull },
    };
  }

  const orders = await Order.find(generateQuery)
    .select("-__v -updatedAt")
    .populate({
      path: "customerId",
      select: "name email phone -_id",
    });

  res.status(200).json(orders);
});

export { getOrders };
