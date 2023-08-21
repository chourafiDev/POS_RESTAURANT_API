import asyncHandler from "express-async-handler";
import History from "../models/historyModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// @desc Get all histories
// @route GET api/history
// @access Privet
const getAllhistories = asyncHandler(async (req, res) => {
  const histories = await History.find();

  res.status(200).json(histories);
});

export { getAllhistories };
