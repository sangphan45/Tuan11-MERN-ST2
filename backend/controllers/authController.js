const User = require('../models/user');
const { validationResult } = require('express-validator');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const cryto = require('crypto');

// Register a user  => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user)
    return res.status(400).json({ success: false, message: 'Email is exists' });

  await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'hard code',
      url: 'hard code',
    },
  }).then((user) => {
    sendToken(user, 200, res);
  });
});

//Login User => api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;

  // Finding user in database
  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorHandler('Invalid Email or Password', 401));

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler('Invalid Email or Password', 401));

  sendToken(user, 200, res);
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  console.log('test');
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  console.log(user.getResetPasswordToken);

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIT Password Recovery',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  console.log(req.params.token);
  // Hash URL token
  const resetPasswordToken = cryto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  // Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar: TODO

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.json({ success: true, users });
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .then((user) => res.json({ success: true, user }))
    .catch((_) =>
      next(
        new ErrorHandler(`User does not found with id : ${req.params.id}`, 400)
      )
    );
});

// Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)
    .then((_) => res.json({ success: true }))
    .catch((_) =>
      next(
        new ErrorHandler(`User does not found with id : ${req.params.id}`, 400)
      )
    );
});
