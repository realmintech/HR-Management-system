// controllers/employeeController.js
const Employee = require('../models/employee');
const User = require('../models/user');

// Get all employees (with pagination)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ 'deleted.isDeleted': false })
      .populate('user', '-password')
      .skip(req.startIndex)
      .limit(req.limit);

    res.json({
      pagination: req.pagination,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee profile
exports.getProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id }).populate(
      'user',
      '-password'
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee profile
exports.updateProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    // Employees can't update salary and role
    if (req.user.role !== 'admin') {
      delete req.body.salary;
      delete req.body.role;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employee._id,
      { $set: req.body },
      { new: true }
    ).populate('user', '-password');

    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({
      'deleted.isDeleted': false,
    });

    const departmentCounts = await Employee.aggregate([
      {
        $match: { 'deleted.isDeleted': false }, 
      },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);

    // Count new hires for the current month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const newHiresThisMonth = await Employee.countDocuments({
      createdAt: { $gte: startOfMonth },
      'deleted.isDeleted': false,
    });

    res.json({
      totalEmployees,
      departmentCounts,
      newHiresThisMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { salary, status, role, position, department } = req.body;
    const employeeId = req.params.id;

    // Validate request body
    if (!salary && !status && !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update',
      });
    }

    // Validate salary
    if (salary && (typeof salary !== 'number' || salary < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Salary must be a positive number',
      });
    }
    // Find employee and check if exists
    const employee = await Employee.findById(employeeId).populate('user');
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Update employee fields if provided
    if (salary) employee.salary = salary;
    if (status) {
      employee.status = status;
      const user = await User.findById(employee.user._id);
      if (user) {
        user.status = status;
        await user.save();
      }
    }
    if (position) employee.position = position;
    if (department) employee.department = department;

    // Save employee changes
    await employee.save();

    // Update user role if provided
    if (role) {
      const user = await User.findById(employee.user._id);
      user.role = role;
      await user.save();
      employee.user.role = role; 
    }

    // Log the update
    console.log(`Employee ${employeeId} updated by ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: {
        _id: employee._id,
        salary: employee.salary,
        status: employee.status,
        user: {
          _id: employee.user._id,
          name: employee.user.name,
          email: employee.user.email,
          role: employee.user.role,
        },
        department: employee.department,
        position: employee.position,
        updatedAt: employee.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Find employee and check if exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if already deleted
    if (employee.deleted.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Employee already deleted',
      });
    }

    // Update delete fields
    employee.deleted = {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user.id, 
    };

    await employee.save();
    // Log the deletion
    console.log(`Employee ${employeeId} soft deleted by ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {
        _id: employee._id,
        name: employee.user.name,
        deletedAt: employee.deleted.deletedAt,
      },
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};

// Optional: Get deleted employees (for admin purposes)
exports.getDeletedEmployees = async (req, res) => {
  try {
    const deletedEmployees = await Employee.find({ 'deleted.isDeleted': true })
      .populate('user', '-password')
      .populate('deleted.deletedBy', 'name email')
      .exec();

    res.status(200).json({
      success: true,
      count: deletedEmployees.length,
      data: deletedEmployees,
    });
  } catch (error) {
    console.error('Fetch deleted employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deleted employees',
      error: error.message,
    });
  }
};

// Optional: Restore deleted employee
exports.restoreEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findOne({
      _id: employeeId,
      'deleted.isDeleted': true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Deleted employee not found',
      });
    }

    employee.deleted = {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    };

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee restored successfully',
      data: employee,
    });
  } catch (error) {
    console.error('Restore employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore employee',
      error: error.message,
    });
  }
};
