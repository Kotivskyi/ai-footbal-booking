const mongoose = require('mongoose');

const testSlots = {
  availableSlot: {
    _id: new mongoose.Types.ObjectId(),
    date: new Date('2024-04-01T10:00:00Z'),
    capacity: 10,
    bookedBy: [],
    price: 50,
    status: 'available'
  },
  fullSlot: {
    _id: new mongoose.Types.ObjectId(),
    date: new Date('2024-04-01T11:00:00Z'),
    capacity: 1,
    bookedBy: [new mongoose.Types.ObjectId()],
    price: 50,
    status: 'full'
  },
  futureSlot: {
    _id: new mongoose.Types.ObjectId(),
    date: new Date('2024-05-01T10:00:00Z'),
    capacity: 10,
    bookedBy: [],
    price: 50,
    status: 'available'
  }
};

module.exports = testSlots; 