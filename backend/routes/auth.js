const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  forgotValidation,
  resetPasswordValidation,
  updateUserProfileValidation,
  updateUserValidation,
} = require('../middlewares/user');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Avatar:
 *       type: object
 *       required:
 *         - public_id
 *         - url
 *       properties:
 *         public_id:
 *           type: string
 *         url:
 *           type: string
 *       example:
 *         public_id: public_id
 *         url: url
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - avatar
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         avatar:
 *           type: object
 *           schema:
 *              $ref: '#/components/schemas/Avatar'
 *       example:
 *         name: john doe
 *         email: johndoe@gmail.com
 *         password: 123456
 *         avatar:
 *          public_id: public_id
 *          url: url
 */
/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.post('/register', registerValidation(), registerUser);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *             required:
 *                 - email
 *                 - password
 *             examples:
 *                  email: johndoe@gmail.com
 *                  password: 1234567
 *     responses:
 *       200:
 *         description: API Login
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.post('/login', loginValidation(), loginUser);

/**
 * @swagger
 * /api/v1/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged success
 *       500:
 *         description: Internal server
 */
router.get('/logout', logout);

/**
 * @swagger
 * /api/v1/password/forgot:
 *   post:
 *     summary: Forgot password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                  type: string
 *             required:
 *                 - email
 *             examples:
 *                  email: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: API forgot password
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.post('/password/forgot', forgotValidation(), forgotPassword);

/**
 * @swagger
 * /api/v1/password/reset/{token}:
 *   put:
 *     summary: Reset password
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: token
 *        schema:
 *          type: string
 *        required: true
 *        description: Token reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              password:
 *                  type: string
 *              confirmPassword:
 *                  type: string
 *             required:
 *                 - password
 *                 - confirmPassword
 *             examples:
 *                  password: 1234567
 *                  confirmPassword: 1234567
 *     responses:
 *       200:
 *         description: API forgot password
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.put('/password/reset/:token', resetPasswordValidation(), resetPassword);

/**
 * @swagger
 * /api/v1/me:
 *   get:
 *     summary: User profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Response user profile
 *       500:
 *         description: Internal server
 */
router.get('/me', isAuthenticatedUser, getUserProfile);

/**
 * @swagger
 * /api/v1/password/update:
 *   put:
 *     summary: Update password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              oldPassword:
 *                  type: string
 *              password:
 *                  type: string
 *             required:
 *                 - oldPassword
 *                 - password
 *     responses:
 *       200:
 *         description: Password update success fully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.put('/password/update', isAuthenticatedUser, updatePassword);

/**
 * @swagger
 * /api/v1/me/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *             required:
 *                 - name
 *                 - email
 *     responses:
 *       200:
 *         description: Update user profile success fully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.put(
  '/me/update',
  isAuthenticatedUser,
  updateUserProfileValidation(),
  updateProfile
);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Get all the user
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get(
  '/admin/users',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  allUsers
);

/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
router.get(
  '/admin/user/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getUserDetails
);
/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              role:
 *                  type: string
 *             required:
 *                 - name
 *                 - email
 *                 - role
 *     responses:
 *       200:
 *         description: Update user success fully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 *
 */
router.put(
  '/admin/user/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  updateUserValidation(),
  updateUser
);

/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Delete user successfully
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
router.delete(
  '/admin/user/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  deleteUser
);

module.exports = router;
