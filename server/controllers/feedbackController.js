const Feedback = require('../models/Feedback');
const Complaint = require('../models/complaint');

const createFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to give feedback on this complaint' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ success: false, message: 'Feedback can only be given on resolved complaints' });
    }

    const existing = await Feedback.findOne({ complaint: complaintId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Feedback already submitted for this complaint' });
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      user: req.user.id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

const getFeedbackByComplaint = async (req, res, next) => {
  try {
    const feedback = await Feedback.findOne({ complaint: req.params.complaintId }).populate('user', 'name email');
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'No feedback found' });
    }
    res.json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .populate('complaint', 'title category')
      .sort({ createdAt: -1 });
    res.json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

module.exports = { createFeedback, getFeedbackByComplaint, getAllFeedback };