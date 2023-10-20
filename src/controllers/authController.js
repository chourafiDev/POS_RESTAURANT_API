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
      new ErrorHandler(`User with this email ${email} not found`, 404)
    );
  }

  // Generate random reset token
  const resetToken = user.createResetPasswordToken();

  await user.save();

  // Send email to reset password
  const resetUrl = `http://localhost:3000/en/reset-password/${resetToken}?email=${email}`;

  const htmlEmail = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <!-- Include the Google Fonts link for Poppins -->
      <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700" rel="stylesheet">
      <style>
          /* Reset some default styles */
          body, p {
              margin: 0;
              padding: 0;
              font-family: 'Poppins', sans-serif; /* Use Open Sans as the font family */
          }
  
          /* Container for the email */
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 30px;
              background-color: #ffffff;
          }
  
          /* Header */
          .header {
              background-color: #f7b941;
              color: #fff;
              text-align: center;
              padding: 10px;
          }

  
          /* Content area */
          .content {
              margin-bottom: 30px
          }

          h5{
            color: #073b4c;
            font-size: 17px
          }
          p{
            color: #264653;
            margin-bottom: 16px;
            font-size: 14px
          }
  
          a {
              background-color: #f7b941;
              color: #264653;
              padding: 8px 16px;
              border-radius: 4px;
              font-size: 13px;
              text-decoration: none;
          }

          /* Footer */
          .footer {
              margin-top: 30px;
              color: #CCD0DB;
              text-align: center;
              padding: 10px;
              font-size: 13px
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <img src="https://res.cloudinary.com/abdelmonaime/image/upload/v1697757215/pos_app/logo_sxxhot.png" width="110" alt="logo">
          </div>
          <div class="content">
              <h5>Reset Password</h5>
              <p>A password reset event has been triggered. The password reset window is limited to 10 minutes.</p>
              <p>If you do not reset your password within two hours, you will need to submit a new request.</p>
              <p>To complete the password reset process, click on the following button:</p>
          </div>
          
          <a href=${resetUrl}>Reset password</a>
           
   
          <div class="footer">
               This message was sent from dissh.
          </div>
      </div>
  </body>
  </html>
  `;

  // try {
  await senEmail({
    email: user.email,
    subject: "Password change request received",
    // message: message,
    html: htmlEmail,
  });

  res.status(200).json({
    message: "Password reset link send to the user email",
  });
  // } catch (error) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetTokenExpires = undefined;
  //   user.save();

  //   return next(
  //     new ErrorHandler(
  //       `There was an error sending password reset email. Please try again later`,
  //       500
  //     )
  //   );
  // }
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
