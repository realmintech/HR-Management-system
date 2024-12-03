const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, admin } = require('../middleware/authMiddleware');
const { paginateResults } = require('../middleware/paginationMiddleware');
const Employee = require('../models/employee');
const {
  validateEmployee,
  validateEmployeeUpdate,
} = require('../middleware/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /api/employees/all:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     responses:
 *       200:
 *         description: A list of employees
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  '/all',
  protect,
  admin,
  paginateResults(Employee),
  employeeController.getEmployees
);

/**
 * @swagger
 * /api/employees/analytics:
 *   get:
 *     summary: Get employee analytics
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     responses:
 *       200:
 *         description: Employee analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/analytics', protect, admin, employeeController.getAnalytics);

/**
 * @swagger
 * /api/employees/{id}/update-status:
 *   put:
 *     summary: Update employee status
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the employee to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Employee status updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id/update-status',
  protect,
  admin,
  employeeController.updateEmployee
);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the employee to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', protect, admin, employeeController.deleteEmployee);

/**
 * @swagger
 * /api/employees/deleted:
 *   get:
 *     summary: Get deleted employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: A list of deleted employees
 *       500:
 *         description: Internal server error
 */
router.get('/deleted', employeeController.getDeletedEmployees);

/**
 * @swagger
 * /api/employees/{id}/restore:
 *   patch:
 *     summary: Restore a deleted employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the employee to restore
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee restored successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id/restore',
  protect,
  admin,
  employeeController.restoreEmployee
);

/**
 * @swagger
 * /api/employees/profile:
 *   get:
 *     summary: Get employee profile
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     responses:
 *       200:
 *         description: Employee profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/profile', protect, employeeController.getProfile);

module.exports = router;