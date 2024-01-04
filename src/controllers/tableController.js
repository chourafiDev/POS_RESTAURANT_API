import asyncHandler from "express-async-handler";
import Table from "../models/tableModel.js";
import History from "../models/historyModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// @desc Create New Table
// @route POST api/tables
// @access Privet
const createTable = asyncHandler(async (req, res, next) => {
  let { number, numberOfGuests, status } = req.body;

  // Check if table already exists
  const tableExist = await Table.findOne({ number });

  if (tableExist) {
    return next(
      new ErrorHandler(`Table with number T-${number} already exists`, 404)
    );
  }

  // Create new Table
  const newTable = await Table.create({
    number,
    numberOfGuests,
    status,
  });

  if (newTable) {
    // Create history for add new table
    await History.create({
      action: "Add",
      description: `Add new table number ${newTable.number}`,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Table created successfuly",
    });
  } else {
    return next(new ErrorHandler(`Invalide table data`, 400));
  }
});

// @desc Get all tables
// @route GET api/tables
// @access Privet
const getAllTables = asyncHandler(async (req, res) => {
  const status = req.query.status || "";

  let generateQuery = {};

  if (status !== "" && status != "all") {
    generateQuery = { status };
  }

  const tables = await Table.find(generateQuery);

  res.status(200).json(tables);
});

// @desc Get table by id
// @route GET api/tables/:id
// @access Privet
const getTableById = asyncHandler(async (req, res) => {
  const tableId = req.params.id;
  const table = await Table.findById(tableId);

  res.status(200).json(table);
});

// @desc Update table
// @route PUT api/tables/:id
// @access Privet
const updateTable = asyncHandler(async (req, res, next) => {
  const tableId = req.params.id;
  const { number, numberOfGuests, status } = req.body;

  // Check if number table already exists
  const tableExist = await Table.findOne({ number });

  if (tableExist && tableId !== tableExist._id.toString()) {
    return next(
      new ErrorHandler(`Table with number T-${number} already exists`, 404)
    );
  }

  const table = await Table.findById(tableId);

  if (table) {
    table.number = number || table.number;
    table.numberOfGuests = numberOfGuests || table.numberOfGuests;
    table.status = status || table.status;

    await table.save();

    // Create history for update table
    await History.create({
      action: "Modification",
      description: `Modify table number ${table.number}`,
      user: req.user._id,
    });

    res.status(200).json({ message: "Table updated Successfuly" });
  } else {
    return next(new ErrorHandler(`Table not found`, 404));
  }
});

// @desc Delete table
// @route DELETE api/tables/:id
// @access Privet
const deleteTable = asyncHandler(async (req, res, next) => {
  // Check table if exists
  const tableId = req.params.id;
  const table = await Table.findOne({ _id: { $eq: tableId } });

  if (!table) {
    return next(new ErrorHandler("Table not found with this id", 404));
  }

  // Delete table
  await Table.findByIdAndRemove(tableId);

  // Create history for delete table
  await History.create({
    action: "Delete",
    description: `Delete table number ${table.number}`,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    messageSuccess: "Table deleted successfuly",
  });
});

export { createTable, getAllTables, updateTable, deleteTable, getTableById };
