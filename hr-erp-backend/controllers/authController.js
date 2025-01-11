// controllers/authController.js
const User = require('../models/user');
const Employee = require('../models/employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Register a new user
// controllers/authController.js
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user first
    const user = await User.create({
      name,
      email,
      password,
      role: 'employee',
    });

    // Create employee profile
    const employee = await Employee.create({
      user: user._id,
      department,
      position,
      salary: 0, // Default salary
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        employee: {
          department: employee.department,
          position: employee.position,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login a user
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is inactive
    if (user.status === 'inactive') {
      return res.status(403).json({
        message:
          'Your account is inactive. Please contact support for assistance.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      emergency_contact,
      emergency_phone,
      department,
      position,
    } = req.body;
    const userId = req.user.id; 

    // Find user and employee
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Update user basic info
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    // Update employee details
    const employee = await Employee.findOne({ user: userId });
    if (employee) {
      employee.phone = phone || employee.phone;
      employee.address = address || employee.address;
      employee.emergency_contact =
        emergency_contact || employee.emergency_contact;
      employee.emergency_phone = emergency_phone || employee.emergency_phone;
      employee.department = department || employee.department;
      employee.position = position || employee.position;
      await employee.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        employee: employee
          ? {
              phone: employee.phone,
              address: employee.address,
              emergency_contact: employee.emergency_contact,
              emergency_phone: employee.emergency_phone,
              department: employee.department,
              position: employee.position,
              status: employee.status,
              joinDate: employee.joinDate,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const employee = await Employee.findOne({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        employee: employee
          ? {
              phone: employee.phone,
              address: employee.address,
              emergency_contact: employee.emergency_contact,
              emergency_phone: employee.emergency_phone,
              department: employee.department,
              position: employee.position,
              status: employee.status,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};
