const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

function pairQuery(userA, userB) {
  return {
    $or: [
      { user1: userA, user2: userB },
      { user1: userB, user2: userA },
    ],
  };
}

async function sendBestEffortEmail(payload) {
  try {
    await sendEmail(payload);
  } catch (error) {
    console.warn('Match notification email failed:', error.message);
  }
}

async function upsertLikeRequest({ actorId, targetUserId, actionType }) {
  const [currentUser, targetUser] = await Promise.all([
    User.findById(actorId).select('name email'),
    User.findById(targetUserId).select('name email'),
  ]);
  if (!currentUser || !targetUser) {
    return { error: { code: 404, message: 'User not found' } };
  }

  let match = await Match.findOne(pairQuery(actorId, targetUserId));

  if (!match) {
    match = new Match({
      user1: actorId,
      user2: targetUserId,
      user1Liked: true,
      initiatedBy: actorId,
      initiatedType: actionType,
    });
  } else {
    if (match.status === 'rejected' || match.status === 'unmatched') {
      match.status = 'pending';
      match.user1Liked = false;
      match.user2Liked = false;
    }
    if (match.user1.toString() === actorId.toString()) {
      match.user1Liked = true;
    } else {
      match.user2Liked = true;
    }
    match.initiatedBy = actorId;
    match.initiatedType = actionType;
  }

  const isMatch = match.checkMatch();
  if (isMatch) match.acceptedAt = new Date();
  await match.save();

  await sendBestEffortEmail({
    to: targetUser.email,
    subject: actionType === 'super_like' ? 'You received a Super Like on HeartConnect' : 'You received a Like on HeartConnect',
    text: `${currentUser.name} sent you a ${actionType === 'super_like' ? 'Super Like' : 'Like'}. Open HeartConnect to respond.`,
  });

  return { currentUser, targetUser, match, isMatch };
}

function normalizeBotKey(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 40);
}

function botPhoneFromKey(botKey) {
  // Stable 10-digit pseudo-phone for unique bot user creation.
  let hash = 0;
  for (let i = 0; i < botKey.length; i++) hash = (hash * 31 + botKey.charCodeAt(i)) % 1000000000;
  const num = 1000000000 + hash;
  return String(num).slice(0, 10);
}

async function ensureBotUser({ botKey, name, gender, bio }) {
  const key = normalizeBotKey(botKey);
  if (!key) return null;

  let bot = await User.findOne({ botKey: key });
  if (bot) return bot;

  const safeGender = ['male', 'female', 'other'].includes(gender) ? gender : 'other';
  const botEmail = `bot_${key}@heartconnect.local`;
  const botPhone = botPhoneFromKey(key);

  bot = await User.create({
    name: name || `Bot ${key}`,
    email: botEmail,
    phone: botPhone,
    password: `BotPass@${key}123`,
    gender: safeGender,
    dateOfBirth: new Date('2000-01-01'),
    bio: bio || 'Hi! I am a demo chat bot profile.',
    isEmailVerified: true,
    verificationBadge: true,
    status: 'active',
    isBot: true,
    botKey: key,
    photos: [],
  });
  return bot;
}

// Get potential matches
router.get('/potential', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const preferredGenders = Array.isArray(user?.preferences?.gender) && user.preferences.gender.length > 0
      ? user.preferences.gender
      : ['male', 'female', 'other'];
    const ageMin = user?.preferences?.ageRange?.min ?? 18;
    const ageMax = user?.preferences?.ageRange?.max ?? 50;
    
    // Build query based on preferences
    const query = {
      _id: { $ne: req.userId },
      status: 'active',
      gender: { $in: preferredGenders },
      age: {
        $gte: ageMin,
        $lte: ageMax,
      },
    };

    // Find users within distance (if location is set)
    if (user.location && user.location.coordinates) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates,
          },
          $maxDistance: user.preferences.distance * 1000, // Convert km to meters
        },
      };
    }

    const potentialMatches = await User.find(query).limit(20);

    res.json(potentialMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Like or Super-like a user
router.post('/like/:userId', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const actionType = req.body?.type === 'super_like' ? 'super_like' : 'like';
    if (targetUserId.toString() === req.userId.toString()) {
      return res.status(400).json({ error: 'You cannot like yourself' });
    }

    const result = await upsertLikeRequest({ actorId: req.userId, targetUserId, actionType });
    if (result.error) return res.status(result.error.code).json({ error: result.error.message });
    const { match, isMatch } = result;

    res.json({
      message: isMatch ? "It's a match!" : actionType === 'super_like' ? 'Super Like sent' : 'Like sent',
      isMatch,
      match,
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Failed to like user' });
  }
});

// Dedicated super-like endpoint for frontend clarity
router.post('/super-like/:userId', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    if (targetUserId.toString() === req.userId.toString()) {
      return res.status(400).json({ error: 'You cannot super-like yourself' });
    }
    const result = await upsertLikeRequest({ actorId: req.userId, targetUserId, actionType: 'super_like' });
    if (result.error) return res.status(result.error.code).json({ error: result.error.message });
    const { match, isMatch } = result;

    res.json({
      message: isMatch ? "It's a match!" : 'Super Like sent',
      isMatch,
      match,
    });
  } catch (error) {
    console.error('Super-like error:', error);
    res.status(500).json({ error: 'Failed to super-like user' });
  }
});

// Super-like a built-in/mock profile and start bot chat immediately
router.post('/super-like-bot', authMiddleware, async (req, res) => {
  try {
    const { botKey, name, gender, bio } = req.body || {};
    const botUser = await ensureBotUser({ botKey, name, gender, bio });
    if (!botUser) return res.status(400).json({ error: 'Invalid bot profile key' });

    let match = await Match.findOne(pairQuery(req.userId, botUser._id));
    if (!match) {
      match = await Match.create({
        user1: req.userId,
        user2: botUser._id,
        user1Liked: true,
        user2Liked: true,
        initiatedBy: req.userId,
        initiatedType: 'super_like',
        status: 'matched',
        matchedAt: new Date(),
        acceptedAt: new Date(),
      });
    } else {
      match.user1Liked = true;
      match.user2Liked = true;
      match.status = 'matched';
      if (!match.matchedAt) match.matchedAt = new Date();
      match.acceptedAt = new Date();
      match.initiatedBy = req.userId;
      match.initiatedType = 'super_like';
      await match.save();
    }

    res.json({
      message: `You are now matched with ${botUser.name}`,
      isMatch: true,
      botUser: {
        id: botUser._id,
        name: botUser.name,
      },
      matchId: match._id,
    });
  } catch (error) {
    console.error('Super-like bot error:', error);
    res.status(500).json({ error: 'Failed to super-like bot profile' });
  }
});

// Incoming pending requests (likes/super-likes)
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const myId = req.userId.toString();
    const pending = await Match.find({ status: 'pending', ...{ $or: [{ user1: req.userId }, { user2: req.userId }] } })
      .populate('user1', 'name age bio photos email')
      .populate('user2', 'name age bio photos email')
      .sort({ updatedAt: -1 });

    const incoming = pending
      .map((m) => {
        const user1Id = m.user1?._id?.toString();
        const user2Id = m.user2?._id?.toString();
        const iAmUser1 = user1Id === myId;
        const iAmUser2 = user2Id === myId;
        if (!iAmUser1 && !iAmUser2) return null;

        const other = iAmUser1 ? m.user2 : m.user1;
        const otherLiked = iAmUser1 ? m.user2Liked : m.user1Liked;
        const iLiked = iAmUser1 ? m.user1Liked : m.user2Liked;
        if (!otherLiked || iLiked) return null;

        return {
          matchId: m._id,
          type: m.initiatedType || 'like',
          fromUser: {
            id: other._id,
            name: other.name,
            age: other.age,
            bio: other.bio || '',
            avatarUrl: other.photos?.find((p) => p.isPrimary)?.url || null,
          },
          createdAt: m.createdAt,
        };
      })
      .filter(Boolean);

    res.json(incoming);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ error: 'Failed to fetch incoming requests' });
  }
});

// Accept or reject an incoming request
router.post('/requests/:matchId/respond', authMiddleware, async (req, res) => {
  try {
    const { action } = req.body || {};
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'action must be accept or reject' });
    }

    const match = await Match.findById(req.params.matchId).populate('user1', 'name email').populate('user2', 'name email');
    if (!match) return res.status(404).json({ error: 'Request not found' });

    const myId = req.userId.toString();
    const isUser1 = match.user1._id.toString() === myId;
    const isUser2 = match.user2._id.toString() === myId;
    if (!isUser1 && !isUser2) {
      return res.status(403).json({ error: 'Not authorized for this request' });
    }

    const incomingLike = isUser1 ? match.user2Liked && !match.user1Liked : match.user1Liked && !match.user2Liked;
    if (!incomingLike || match.status !== 'pending') {
      return res.status(400).json({ error: 'No pending incoming request to respond to' });
    }

    if (action === 'reject') {
      match.status = 'rejected';
      match.rejectedAt = new Date();
      match.unmatchedBy = req.userId;
      await match.save();
      return res.json({ message: 'Request rejected', isMatch: false });
    }

    if (isUser1) match.user1Liked = true;
    if (isUser2) match.user2Liked = true;
    const isMatch = match.checkMatch();
    if (isMatch) match.acceptedAt = new Date();
    await match.save();

    if (isMatch) {
      const requester = isUser1 ? match.user2 : match.user1;
      const accepter = isUser1 ? match.user1 : match.user2;
      await sendBestEffortEmail({
        to: requester.email,
        subject: 'Your request was accepted on HeartConnect',
        text: `${accepter.name} accepted your request. You can now chat in the app.`,
      });
    }

    res.json({ message: "It's a match!", isMatch: true, match });
  } catch (error) {
    console.error('Respond request error:', error);
    res.status(500).json({ error: 'Failed to respond to request' });
  }
});

// Get user's matches
router.get('/my-matches', authMiddleware, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.userId }, { user2: req.userId }],
      status: 'matched',
    })
      .populate('user1', 'name age location photos')
      .populate('user2', 'name age location photos');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Unmatch
router.delete('/:matchId', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    match.status = 'unmatched';
    match.unmatchedAt = new Date();
    match.unmatchedBy = req.userId;
    await match.save();

    res.json({ message: 'Unmatched successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unmatch' });
  }
});

module.exports = router;
