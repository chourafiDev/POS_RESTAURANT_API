import asyncHandler from "express-async-handler";

// @desc Auth use/set token
// @route POST api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "test message" });
});

export { register };
