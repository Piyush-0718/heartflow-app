const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Create a report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { reportedUser, reportedContent, reason, description } = req.body;

    const report = new Report({
      reportedBy: req.userId,
      reportedUser,
      reportedContent,
      reason,
      description,
    });

    await report.save();

    res.status(201).json({
      message: 'Report submitted successfully. Our team will review it within 24-36 hours.',
      report,
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get user's reports
router.get('/my-reports', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.userId })
      .populate('reportedUser', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Block a user for the current user
router.post('/block', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (userId === req.userId) {
      return res.status(400).json({ error: 'You cannot block yourself' });
    }

    await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { blockedUsers: userId } },
      { new: true }
    );

    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Unblock a user for the current user
router.post('/unblock', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { blockedUsers: userId } },
      { new: true }
    );

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

module.exports = router;
