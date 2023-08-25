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

// @desc Update profile image
// @route PUT api/profile/image-profile
// @access Privet
const updateProfileImage = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user.id;
  const { image } = req.body;

  const user = await User.findById(currentUserId);

  if (user) {
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

    res.status(200).json({ message: "Profile Image Updated Successfuly" });
  } else {
    return next(new ErrorHandler(`User not found`, 404));
  }
});

// @desc Update Profile Password
// @route POST api/profile/update-password
// @access Privet
const updateProfilePassword = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user.id;
  let { password } = req.body;

  // Check if user already exists
  const user = await User.findById(currentUserId);

  if (user) {
    user.password = password;
  } else {
    return next(
      new ErrorHandler(`User with this email (${email}) already exists`, 404)
    );
  }
});

export {
  updateCurrentUser,
  getCurrentUser,
  updateProfileImage,
  updateProfilePassword,
};
