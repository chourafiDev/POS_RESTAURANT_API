import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import History from "../models/historyModel.js";

// @desc Create New User
// @route POST api/users/create-user
// @access Privet
const createUser = asyncHandler(async (req, res, next) => {
  let { firstName, lastName, email, address, phone, image, role, password } =
    req.body;

  // Check if user already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(
      new ErrorHandler(`User with this email (${email}) already exists`, 404)
    );
  }

  // Upload image to cloudinary
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "pos_app/avatars",
    });

    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

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
    return next(new ErrorHandler(`Invalide user data`, 400));
  }
});

// @desc Get all users
// @route GET api/users
// @access Privet
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(users);
});

// @desc Get user profile
// @route GET api/users/profile
// @access Privet
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password");

  res.status(200).json(user);
});

// @desc Update user
// @route PUT api/users/{userId}
// @access Privet
const updateUserProfile = asyncHandler(async (req, res, next) => {
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
    return next(new ErrorHandler(`User not found`, 404));
  }

  res.status(200).json({
    message: "Update profile",
  });
});

// @desc Delete user
// @route DELETE api/users/{userId}
// @access Privet
const deleteUser = asyncHandler(async (req, res, next) => {
  // Check user if exists
  const userId = req.params.id;
  const user = await User.findOne({ _id: { $eq: userId } });
  console.log(req.user);
  if (!user) {
    return next(new ErrorHandler("User not found with this id", 404));
  }

  //Remove user photo
  const imageId = user.image.public_id;
  if (imageId) {
    await cloudinary.uploader.destroy(imageId);
  }

  // Delete user
  await User.findByIdAndRemove(userId);

  //History delete user
  await History.create({
    action: "Deletion",
    description: `Delete user (${user.firstName} ${user.lastName})`,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    messageSuccess: "User deleted successfuly",
  });
});

export {
  createUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
