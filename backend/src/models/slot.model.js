const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity must be specified'],
    min: [1, 'Capacity must be at least 1']
  },
  bookedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['available', 'full'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Add compound index on date and time for faster lookups
slotSchema.index({ date: 1, time: 1 });

// Add index on bookedBy for faster lookup of user bookings
slotSchema.index({ bookedBy: 1 });

// Add compound index for faster queries
slotSchema.index({ date: 1, time: 1, capacity: 1 });

// Update status based on capacity and bookings
slotSchema.pre('save', function(next) {
  this.status = this.bookedBy.length >= this.capacity ? 'full' : 'available';
  next();
});

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot; 