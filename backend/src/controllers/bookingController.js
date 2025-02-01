const bookingService = require('../services/bookingService');
const Slot = require('../models/Slot');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const getAllSlots = async (req, res) => {
  try {
    const slots = await bookingService.getAvailableSlots();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookSlot = async (req, res, next) => {
  try {
    logger.trace('Booking slot - start');
    const { slotId } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(slotId)) {
      logger.debug('Invalid slot ID format', { slotId });
      throw new AppError('Invalid slot ID format', 400);
    }

    logger.debug('Booking slot', { userId: req.user.id, slotId });
    const bookedSlot = await bookingService.bookSlot(req.user.id, slotId);
    
    logger.trace('Booking slot - success');
    res.json({
      success: true,
      data: bookedSlot
    });
  } catch (error) {
    logger.error('Error booking slot:', error.message);
    next(error);
  }
};

module.exports = {
  getAllSlots,
  bookSlot
};
