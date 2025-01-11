const { body } = require('express-validator');

exports.validateProfileUpdate = [
  body('contactInfo.phone').optional().isMobilePhone(),
  body('contactInfo.address').optional().trim().notEmpty(),
  body('contactInfo.emergencyContact').optional().trim().notEmpty(),
  body('department').optional().trim().notEmpty(),
  body('position').optional().trim().notEmpty(),
];

exports.validateRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),

  body('email')
    .isEmail()
    .withMessage('Email is invalid')
    .normalizeEmail()
    .trim(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),

//   body('department').notEmpty().withMessage('Department is required').trim(),

//   body('position').notEmpty().withMessage('Position is required').trim(),
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email is invalid')
    .normalizeEmail()
    .trim(),

  body('password').notEmpty().withMessage('Password is required'),
];

exports.validateEmployeeUpdate = [
  ...exports.validateProfileUpdate,
  body('salary').optional().isNumeric(),
];
