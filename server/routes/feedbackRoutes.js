const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbackByComplaint,
  getAllFeedback,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createFeedback);
router.get('/:complaintId', protect, getFeedbackByComplaint);
router.get('/', protect, authorize('ADMIN'), getAllFeedback);

module.exports = router;