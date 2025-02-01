const Slot = require('../models/Slot');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');

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

const bookSlot = async (userId, slotId) => {
    logger.trace(`Attempting to book slot ${slotId} for user ${userId}`);
    
    try {
        // Check if slot exists and is not at capacity
        const slot = await Slot.findById(slotId);
        if (!slot) {
            logger.error(`Slot ${slotId} not found`);
            throw new AppError('Slot not found', 404);
        }

        // Check capacity
        if (slot.bookedBy.length >= slot.capacity) {
            logger.debug(`Slot ${slotId} is at full capacity`);
            throw new AppError('Slot is already at full capacity', 409);
        }

        // Check if user already has a booking
        if (slot.bookedBy.includes(userId)) {
            logger.debug(`User ${userId} already has a booking for slot ${slotId}`);
            throw new AppError('You have already booked this slot', 409);
        }

        // Update slot with new booking
        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            { $push: { bookedBy: userId } },
            { new: true }
        );

        logger.debug(`Successfully booked slot ${slotId} for user ${userId}`);
        return updatedSlot;
    } catch (error) {
        logger.error(`Error booking slot: ${error.message}`);
        throw error;
    }
};

module.exports = {
  getAvailableSlots,
  bookSlot
};
