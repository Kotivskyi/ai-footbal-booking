const Slot = require('../models/Slot');

const getAvailableSlots = async () => {
  try {
    const now = new Date();
    return await Slot.aggregate([
      {
        $match: {
          date: { $gte: now },
          $expr: { $lt: [{ $size: "$bookedBy" }, "$capacity"] }
        }
      },
      {
        $project: {
          _id: 1,
          date: 1,
          time: 1, 
          capacity: 1,
          availableSpots: { $subtract: ["$capacity", { $size: "$bookedBy" }] }
        }
      },
      { $sort: { date: 1, time: 1 } }
    ]);
  } catch (error) {
    throw new Error('Error fetching available slots: ' + error.message);
  }
};

module.exports = {
  getAvailableSlots
};
