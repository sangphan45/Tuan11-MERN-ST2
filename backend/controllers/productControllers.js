const Product = require('../models/product');
const { validationResult } = require('express-validator');
const ErrorHandle = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
// Create new product => /api/v1/products/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  req.body.user = req.user.id;
  Product.create(req.body).then((product) => {
    res.status(200).json({
      success: true,
      product,
    });
  });
});
// Find all product => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = req.query.size || 4;
  const productCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product, req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    .sort();

  const products = await apiFeatures.query;

  res.json({ success: true, count: products.length, productCount, products });
});

// Get single product details => /api/v1/products/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => res.json({ success: true, product }))
    .catch((_) => next(new ErrorHandle('Product not found', 400)));
});

// Update Product => /api/v1/products/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    upsert: true,
  })
    .then((product) => res.json({ success: true, product }))
    .catch((_) => next(new ErrorHandle('Product not found', 400)));
});

// Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  Product.findByIdAndDelete(req.params.id)
    .then((_) => res.json({ success: true, message: 'Product is deleted' }))
    .catch((_) => next(new ErrorHandle('Product not found', 400)));
});
