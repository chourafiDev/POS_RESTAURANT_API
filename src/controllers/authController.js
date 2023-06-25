import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc Create New User user/set token
// @route POST api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(201).json({
      message: "Logged in successfuly",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
    });
  } else {
    res.status(400);
    throw new Error(`Invalide email or password`);
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

export { login, logout };
