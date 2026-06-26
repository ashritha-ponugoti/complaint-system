const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateStatus,
  assignAgent,
  addMessage,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getComplaints);
router.post('/', protect, createComplaint);
router.get('/:id', protect, getComplaint);
router.put('/:id/status', protect, authorize('ADMIN', 'AGENT'), updateStatus);
router.put('/:id/assign', protect, authorize('ADMIN'), assignAgent);
router.post('/:id/messages', protect, addMessage);
router.delete('/:id', protect, authorize('ADMIN'), deleteComplaint);

module.exports = router;