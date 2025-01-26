const Slot = require('../models/slot.model');

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
    throw error;
  }
};

module.exports = {
  getAvailableSlots
};
