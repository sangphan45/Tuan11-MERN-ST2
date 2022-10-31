const { body } = require('express-validator');
exports.registerValidation = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your name')
      .isLength({ max: 30 })
      .withMessage('Your name cannot exceed 30 characters'),
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your email')
      .isEmail()
      .withMessage('Email invalid'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Your password must be longer than 6 characters'),
  ];
};

exports.loginValidation = () => {
  return [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your email')
      .isEmail()
      .withMessage('Email invalid'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Your password must be longer than 6 characters'),
  ];
};

exports.forgotValidation = () => {
  return [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your email')
      .isEmail()
      .withMessage('Email invalid'),
  ];
};

exports.resetPasswordValidation = () => {
  return [
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Your password must be longer than 6 characters'),
    body('confirmPassword')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Your confirm password must be longer than 6 characters'),
  ];
};

exports.updateUserProfileValidation = () => {
  return [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your email')
      .isEmail()
      .withMessage('Email invalid'),
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your name')
      .isLength({ max: 30 })
      .withMessage('Your name cannot exceed 30 characters'),
  ];
};

exports.updateUserValidation = () => {
  return [
    body('email')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your email')
      .isEmail()
      .withMessage('Email invalid'),
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your name')
      .isLength({ max: 30 })
      .withMessage('Your name cannot exceed 30 characters'),
    body('role')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter your role')
      .isLength({ max: 30 })
      .withMessage('Your role cannot exceed 30 characters'),
  ];
};
