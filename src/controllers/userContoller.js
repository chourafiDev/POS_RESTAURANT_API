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
    // Create history for add new user
    await History.create({
      action: "Add",
      description: `Add new user ${newUser.firstName} ${newUser.lastName}`,
      user: req.user._id,
    });

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

// @desc Get current user
// @route GET api/users/profile
// @access Privet
const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password");

  res.status(200).json(user);
});

// @desc Get user by id
// @route GET api/users/:id
// @access Privet
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");

  res.status(200).json(user);
});

// @desc Update user
// @route PUT api/users/:id
// @access Privet
const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { firstName, lastName, email, address, phone, image } = req.body;

  const user = await User.findById(userId);
  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    //Update user image
    if (image) {
      const image_id = user.image.public_id;

      if (image_id) {
        //Delete previous image
        await cloudinary.uploader.destroy(image_id);
      }

      //add new image
      const result = await cloudinary.uploader.upload(image, {
        folder: "pos_app/avatars",
      });

      user.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();

    // Create history for update user
    await History.create({
      action: "Modification",
      description: `Modify user ${user.firstName} ${user.lastName}`,
      user: req.user._id,
    });

    res.status(200).json({ message: "User Updated Successfuly" });
  } else {
    return next(new ErrorHandler(`User not found`, 404));
  }
});

// @desc Delete user
// @route DELETE api/users/:id
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

  // Create history for delete user
  await History.create({
    action: "Delete",
    description: `Delete user ${user.firstName} ${user.lastName}`,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    messageSuccess: "User deleted successfuly",
  });
});

export {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
  getCurrentUser,
};
