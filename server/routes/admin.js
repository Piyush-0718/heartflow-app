const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Report = require('../models/Report');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all reports (Admin only)
router.get('/reports', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .populate('reportedUser', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Resolve report (Admin only)
router.put('/reports/:reportId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { resolution, resolutionNotes } = req.body;

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.status = 'resolved';
    report.resolution = resolution;
    report.resolutionNotes = resolutionNotes;
    report.reviewedBy = req.userId;
    report.reviewedAt = new Date();

    await report.save();

    // Take action on user if needed
    if (resolution === 'suspension' || resolution === 'ban') {
      await User.findByIdAndUpdate(report.reportedUser, {
        status: resolution === 'ban' ? 'banned' : 'suspended',
        suspensionReason: resolutionNotes,
      });
    }

    res.json({ message: 'Report resolved successfully', report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve report' });
  }
});

// Get all users (Admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Suspend user (Admin only)
router.put('/users/:userId/suspend', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { reason, duration } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        status: 'suspended',
        suspensionReason: reason,
        suspensionExpiry: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null,
      },
      { new: true }
    );

    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

// Get dashboard stats (Admin only)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const verifiedUsers = await User.countDocuments({ verificationBadge: true });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      activeUsers,
      verifiedUsers,
      pendingReports,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
