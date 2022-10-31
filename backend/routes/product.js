const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { productCreateValidation } = require('../middlewares/product');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - rating
 *         - images
 *         - category
 *         - seller
 *         - stock
 *         - numOfReviews
 *         - reviews
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: String
 *         images:
 *           type: array
 *         category:
 *           type: string
 *         seller:
 *           type: string
 *         stock:
 *           type: number
 *         numOfReviews:
 *           type: number
 *         reviews:
 *           type: list
 *       example:
 *         name: Can USB FD Adapter (GC-CAN-USB-FD)
 *         price: 915.00
 *         description: Monitor a Can network...
 *         rating: 1.65
 *         images: []
 *         category: Electronics
 *         seller: Ebay
 *         stock: 50
 *         numOfReviews: 32
 *         reviews: []
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */
/**
 * @swagger
 * /api/v1/admin/products/new:
 *   post:
 *     summary: Create a new Product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.post(
  '/admin/products/new',
  productCreateValidation(),
  isAuthenticatedUser,
  newProduct
);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get the list of all the product
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Query keyword
 *       - in: query
 *         name: multiSearchColumn
 *         schema:
 *           type: string
 *         description: Query column example category,name
 *       - in: query
 *         name: price[gte]
 *         schema:
 *           type: number
 *         description: Query price grater than equal
 *       - in: query
 *         name: price[lte]
 *         schema:
 *           type: number
 *         description: Query price less than equal
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: page
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         description: size
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: name,asc
 *     responses:
 *       200:
 *         description: The list of the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/products', isAuthenticatedUser, getProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get('/products/:id', isAuthenticatedUser, getSingleProduct);

/**
 * @swagger
 * /api/v1/admin/products/{id}:
 *   put:
 *     summary: Update a new Product
 *     tags: [Products]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.put(
  '/admin/products/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  productCreateValidation(),
  updateProduct
);

/**
 * @swagger
 * /api/v1/admin/products/{id}:
 *   delete:
 *     summary: Delete the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product is deleted
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.delete(
  '/admin/products/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  deleteProduct
);

module.exports = router;
