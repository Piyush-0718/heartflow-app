const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Match = require('../models/Match');
const { authMiddleware } = require('../middleware/auth');

async function getBlockStatus(userId, otherUserId) {
  const [iBlocked, blockedMe] = await Promise.all([
    User.exists({ _id: userId, blockedUsers: otherUserId }),
    User.exists({ _id: otherUserId, blockedUsers: userId }),
  ]);
  return {
    blocked: !!iBlocked || !!blockedMe,
    iBlocked: !!iBlocked,
    blockedMe: !!blockedMe,
  };
}

function toChatMessage(doc, currentUserId) {
  const senderId = doc.sender?._id ? doc.sender._id.toString() : doc.sender.toString();
  const receiverId = doc.receiver?._id ? doc.receiver._id.toString() : doc.receiver.toString();
  return {
    id: doc._id,
    senderId,
    receiverId,
    text: doc.content,
    type: doc.type,
    replyTo: doc.replyTo || null,
    replyMeta: doc.replyMeta || null,
    isMine: senderId === currentUserId.toString(),
    createdAt: doc.createdAt,
    isRead: doc.isRead,
  };
}

async function areUsersMatched(userA, userB) {
  const match = await Match.findOne({
    status: 'matched',
    $or: [
      { user1: userA, user2: userB },
      { user1: userB, user2: userA },
    ],
  }).select('_id');
  return !!match;
}

// Conversation list for sidebar
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.userId);
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
          isDeleted: { $ne: true },
          deletedBy: { $ne: currentUserId },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', currentUserId] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$content' },
          lastMessageAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', currentUserId] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
      { $limit: 50 },
    ]);

    const matchedRows = await Match.find({
      status: 'matched',
      $or: [{ user1: req.userId }, { user2: req.userId }],
    }).select('user1 user2');

    const matchedUserIds = matchedRows.map((m) =>
      m.user1.toString() === req.userId.toString() ? m.user2 : m.user1
    );

    const userIdSet = new Set([
      ...conversations.map((c) => c._id.toString()),
      ...matchedUserIds.map((id) => id.toString()),
    ]);
    const userIds = Array.from(userIdSet).map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({ _id: { $in: userIds } }).select('name bio isOnline isBot verificationBadge isEmailVerified photos');
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const convoMap = new Map(conversations.map((c) => [c._id.toString(), c]));

    const payload = userIds
      .map((idObj) => {
        const id = idObj.toString();
        const peer = userMap.get(id);
        const c = convoMap.get(id);
        if (!peer) return null;
        return {
          userId: peer._id.toString(),
          name: peer.name,
          bio: peer.bio || '',
          online: peer.isBot ? true : !!peer.isOnline,
          isBot: !!peer.isBot,
          verified: !!peer.verificationBadge,
          emailVerified: !!peer.isEmailVerified,
          avatarUrl: peer.photos?.find((p) => p.isPrimary)?.url || null,
          lastMessage: c?.lastMessage || '',
          lastMessageAt: c?.lastMessageAt || null,
          unreadCount: c?.unreadCount || 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));

    res.json(payload);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get relationship/status for one conversation peer
router.get('/status/:userId', authMiddleware, async (req, res) => {
  try {
    const status = await getBlockStatus(req.userId, req.params.userId);
    res.json(status);
  } catch (error) {
    console.error('Get conversation status error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation status' });
  }
});

// Get conversation messages with one user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.userId },
      ],
      isDeleted: { $ne: true },
      deletedBy: { $ne: req.userId },
    })
      .sort({ createdAt: 1 })
      .limit(500);

    res.json(messages.map((m) => toChatMessage(m, req.userId)));
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Persist a new message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, text, type = 'text', replyTo } = req.body;
    if (!receiverId || !text?.trim()) {
      return res.status(400).json({ error: 'receiverId and text are required' });
    }

    const status = await getBlockStatus(req.userId, receiverId);
    if (status.blocked) {
      return res.status(403).json({ error: 'Messaging is blocked for this user pair' });
    }

    const matched = await areUsersMatched(req.userId, receiverId);
    if (!matched) {
      return res.status(403).json({ error: 'You can only message users with mutual accepted matches' });
    }

    const message = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      content: text.trim(),
      type,
      replyTo: replyTo?.id || undefined,
      replyMeta: replyTo
        ? {
            text: String(replyTo.text || ''),
            type: replyTo.type || 'text',
            senderId: replyTo.senderId || undefined,
          }
        : undefined,
      isModerated: true,
    });

    res.status(201).json(toChatMessage(message, req.userId));
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Mark messages from one user as read
router.patch('/:userId/read', authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const result = await Message.updateMany(
      { sender: otherUserId, receiver: req.userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    res.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Clear conversation
// scope=me: hide conversation for current user only
// scope=everyone: remove conversation for both users
router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const scope = req.body?.scope === 'everyone' ? 'everyone' : 'me';

    const baseQuery = {
      $or: [
        { sender: req.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.userId },
      ],
      isDeleted: { $ne: true },
    };

    let result;
    if (scope === 'everyone') {
      result = await Message.updateMany(baseQuery, {
        $set: {
          isDeleted: true,
          deletedBy: [req.userId, otherUserId],
        },
      });
    } else {
      result = await Message.updateMany(
        { ...baseQuery, deletedBy: { $ne: req.userId } },
        { $addToSet: { deletedBy: req.userId } }
      );
    }

    res.json({
      message: scope === 'everyone' ? 'Chat cleared for everyone' : 'Chat cleared for you',
      updated: result.modifiedCount ?? 0,
      scope,
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

module.exports = router;
