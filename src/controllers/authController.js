import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import senEmail from "../utils/email.js";
import generateToken from "../utils/generateToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import crypto from "crypto";

// @desc Create New User user/set token
// @route POST api/auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user already exists
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
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

// @desc forgot password
// @route POST api/auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res, next) => {
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

  // Send email to reset password
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${resetToken}`;

  const message = `We have received a password reset request, Please use below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 1O minutes.`;

  try {
    await senEmail({
      email: user.email,
      subject: "Password change request received",
      message: message,
    });

    res.status(200).json({
      message: "Password reset link send to the user email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save();

    return next(
      new ErrorHandler(
        `There was an error sending password reset email. Please try again later`,
        500
      )
    );
  }
});

// @desc reset password
// @route PATCH api/auth/reset-password
// @access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler(`Token is invalid or has expired`, 400));
  }

  // Reseting the user password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  user.save();

  // Login the user
  generateToken(res, user._id);

  res.status(200).json({ status: "success" });
});

export { login, logout, forgotPassword, resetPassword };
