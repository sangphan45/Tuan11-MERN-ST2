const Product = require('../models/product');
const { connectDatabase } = require('../config/connectDatabase');
const products = require('../data/products.json');
connectDatabase();
const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('Product are deleted');

    await Product.insertMany(products);
    console.log('All products are added');
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedProducts();
