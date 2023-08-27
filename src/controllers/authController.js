import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// @desc Create New User user/set token
// @route POST api/auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user already exists
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } else {
    return next(new ErrorHandler("Invalide email or password", 401));
  }
});

// @desc Logout User
// @route POST api/auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out successfuly",
  });
});

// @desc Get user profile
// @route GET api/users/profile
// @access Privet
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password");

  res.status(200).json(user);
});

// @desc Get user profile
// @route GET api/users/profile
// @access Privet
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorHandler(`User with this email ${email} not found`, 401)
    );
  }

  // Generate random reset token
  const resetToken = user.createResetPasswordToken();

  await user.save();

  res.status(200).json(user);
});

export { login, logout, getUserProfile, forgotPassword };
