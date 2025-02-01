const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', bookingController.getAllSlots);

// Add new route for booking a slot
router.post('/book/:slotId', authenticate, bookingController.bookSlot);


router.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message
  });
});

module.exports = router;
