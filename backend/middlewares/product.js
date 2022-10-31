const { body } = require('express-validator');
exports.productCreateValidation = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter product name')
      .isLength({ max: 100 })
      .withMessage('Product name cannot exceed 100 characters'),
    body('price')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Price allowed is type number'),
    body('description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter product description'),
    body('rating')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Rating allowed is type number'),
    body('category')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter product name'),
    body('seller')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please enter seller'),
    body('stock')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Stock allowed is type number'),
    body('numOfReviews')
      .trim()
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage('Stock allowed is type number'),
  ];
};
