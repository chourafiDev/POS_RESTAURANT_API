import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";

// @desc Create New User
// @route POST api/users/create-user
// @access Privet
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, address, phone, image, role, password } =
    req.body;

  // Check if user already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error(`User with this email (${email}) already exists`);
  }

  // Upload image to cloudinary
  const result = await cloudinary.uploader.upload(image, {
    folder: "pos_app/menu",
  });
  conso.log("result", result);
  image = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  // Create new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    address,
    phone,
    image,
    role,
    password,
  });

  if (newUser) {
    res.status(201).json({
      message: "User created successfuly",
    });
  } else {
    res.status(400);
    throw new Error(`Invalide user data`);
  }
});

// @desc Get user profile
// @route POST api/users/profile
// @access Privet
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(users);
});

// @desc Get user profile
// @route POST api/users/profile
// @access Privet
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password");

  res.status(200).json(user);
});

// @desc Get user profile
// @route POST api/users/profile
// @access Privet
const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstName, lastName, email, address, phone, image, password } =
    req.body;

  const user = await User.findById(_id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({ message: "User Updated Successfuly" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    message: "Update profile",
  });
});

export { createUser, getUserProfile, updateUserProfile, getAllUsers };
