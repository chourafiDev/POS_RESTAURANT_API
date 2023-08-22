import asyncHandler from "express-async-handler";
import History from "../models/historyModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// @desc Get all histories
// @route GET api/history
// @access Privet
const getAllhistories = asyncHandler(async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  console.log("startDate", startDate);
  console.log("endDate", endDate);

  const endDateFull = new Date(endDate);
  endDateFull.setHours(23, 59, 59, 999); // Set to the end of the day

  let generateQuery = {};

  if (startDate && endDate) {
    generateQuery = {
      createdAt: { $gte: new Date(startDate), $lte: endDateFull },
    };
  }

  const histories = await History.find(generateQuery);

  res.status(200).json(histories);
});

// @desc Delete history
// @route DELETE api/history
// @access Privet
const deleteHistory = asyncHandler(async (req, res) => {
  // Check history if exists
  const historyId = req.params.id;
  const history = await History.findOne({ _id: { $eq: historyId } });

  if (!history) {
    return next(new ErrorHandler("History not found with this id", 404));
  }

  // Delete history
  await History.findByIdAndRemove(historyId);

  res.status(200).json({
    success: true,
    messageSuccess: "History deleted successfuly",
  });
});

// @desc Delete histories
// @route DELETE api/history
// @access Privet
const deleteHistories = asyncHandler(async (req, res) => {
  // Check history if exists
  const historiesId = req.body.ids;

  // Delete histories
  await History.deleteMany({
    _id: {
      $in: historiesId,
    },
  });

  res.status(200).json({
    success: true,
    messageSuccess: "Histories deleted successfuly",
  });
});

export { getAllhistories, deleteHistory, deleteHistories };
