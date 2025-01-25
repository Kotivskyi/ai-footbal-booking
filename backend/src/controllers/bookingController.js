const bookingService = require('../services/bookingService');
const Slot = require('../models/Slot');

const getAllSlots = async (req, res) => {
  try {
    const slots = await bookingService.getAvailableSlots();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSlots
};
