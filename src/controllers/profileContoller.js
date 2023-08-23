import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// @desc Get current user
// @route GET api/profile
// @access Privet
const getCurrentUser = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const user = await User.findById(currentUserId).select("-password");

  res.status(200).json(user);
});

// @desc Update current user
// @route PUT api/profile
// @access Privet
const updateCurrentUser = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user.id;
  const { firstName, lastName, email, address, phone } = req.body;

  const user = await User.findById(currentUserId);
  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({ message: "Profile Updated Successfuly" });
  } else {
    return next(new ErrorHandler(`Profile not found`, 404));
  }
});

export { updateCurrentUser, getCurrentUser };
