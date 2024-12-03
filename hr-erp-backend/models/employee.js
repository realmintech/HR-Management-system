const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department'],
      default: 'Engineering',
    },
    position: {
      type: String,
      required: [true, 'Please provide a position'],
      default: 'Intern',
    },

    salary: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Please provide a valid phone number',
      ],
    },
    address: {
      type: String,
      trim: true,
    },
    emergency_contact: {
      type: String,
      trim: true,
    },
    emergency_phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Please provide a valid emergency contact number',
      ],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave'],
      default: 'active',
    },
    documents: [
      {
        type: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deleted: {
      isDeleted: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
      deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    leaves: [
      {
        type: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        reason: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better query performance
employeeSchema.index({ user: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

employeeSchema.pre('find', function () {
  if (!this.getQuery()['deleted.isDeleted']) {
    this.where({ 'deleted.isDeleted': false });
  }
});

employeeSchema.pre('findOne', function () {
  if (!this.getQuery()['deleted.isDeleted']) {
    this.where({ 'deleted.isDeleted': false });
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
