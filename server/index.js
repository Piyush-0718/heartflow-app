const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Message = require('./models/Message');
const User = require('./models/User');
const Match = require('./models/Match');

// Load .env.local first for local development, then .env fallback.
dotenv.config({ path: '.env.local' });
dotenv.config();

// Avoid long buffered DB waits when Mongo is unavailable.
mongoose.set('bufferCommands', false);

function parseAllowedOrigins() {
  const raw = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000';
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function validateProductionEnv() {
  if (process.env.NODE_ENV !== 'production') return;

  const required = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter((key) => !String(process.env[key] || '').trim());
  if (missing.length > 0) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }

  const jwtSecret = String(process.env.JWT_SECRET || '');
  if (jwtSecret.length < 32 || jwtSecret === 'your-secret-key') {
    throw new Error('JWT_SECRET is too weak for production. Use a random value (32+ chars).');
  }
}

validateProductionEnv();
const allowedOrigins = parseAllowedOrigins();

const app = express();
const server = http.createServer(app);

const trustProxy = String(process.env.TRUST_PROXY || '1').toLowerCase();
if (trustProxy === '1' || trustProxy === 'true') {
  app.set('trust proxy', 1);
}

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.disable('x-powered-by');
app.use(helmet());
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});
app.use(cors({
  origin(origin, callback) {
    // Allow non-browser requests (curl, server-to-server) and configured web origins.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // general API ceiling per IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Too many auth attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: 'Too many message requests. Slow down for a minute.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heartconnect', {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', messageLimiter, require('./routes/messages'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'ok' : 'degraded',
    message: 'HeartConnect API is running',
    db: dbReady ? 'connected' : 'disconnected',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Readiness endpoint for deployment probes/load balancers
app.get('/api/ready', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  if (!dbReady) {
    return res.status(503).json({ status: 'not_ready', db: 'disconnected' });
  }
  return res.json({ status: 'ready' });
});

function getRoomId(userA, userB) {
  return [userA.toString(), userB.toString()].sort().join(':');
}

function getUserRoomId(userId) {
  return `user:${userId.toString()}`;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

function getHeuristicBotReply({ botName, message, type, lastBotReply }) {
  const text = String(message || '').trim().toLowerCase();
  const avoid = String(lastBotReply || '').trim();

  const pools = {
    image: [
      `Nice photo. You have a great aesthetic.`,
      `That picture looks lovely. Where was it taken?`,
      `Great shot. What was the story behind this photo?`,
    ],
    audio: [
      `Your voice note was clear and warm. What are you up to today?`,
      `I liked hearing that. Want to tell me more?`,
      `Nice voice note. What topic should we dive into next?`,
    ],
    greeting: [
      `Hey! I am ${botName}. How has your day been so far?`,
      `Hi there. Happy to chat with you. What is on your mind today?`,
      `Hello! Nice to hear from you. What are you doing right now?`,
    ],
    hobbies: [
      `I enjoy music, movies, and long conversations. What do you enjoy most?`,
      `I am into meaningful chats and fun topics. What are your top interests?`,
      `I like travel stories and food talks. What about you?`,
    ],
    question: [
      `Good question. I would say it depends on mood and energy. What do you think?`,
      `Interesting question. I am curious about your take first.`,
      `I like that question. Can you share your side too?`,
    ],
    default: [
      `That sounds interesting. Tell me more about it.`,
      `I like where this conversation is going. What happened next?`,
      `Nice. I would love to hear more detail from you.`,
      `That is thoughtful. What made you feel that way?`,
    ],
  };

  const pick = (arr) => {
    const filtered = arr.filter((x) => x !== avoid);
    const source = filtered.length > 0 ? filtered : arr;
    return source[Math.floor(Math.random() * source.length)];
  };

  if (type === 'image') return pick(pools.image);
  if (type === 'audio') return pick(pools.audio);
  if (text.includes('hi') || text.includes('hello') || text.includes('hey')) return pick(pools.greeting);
  if (text.includes('hobby') || text.includes('interest') || text.includes('like to do')) return pick(pools.hobbies);
  if (text.includes('?')) return pick(pools.question);
  return pick(pools.default);
}

async function callGeminiGenerate({ systemInstruction, userPrompt }) {
  if (!GEMINI_API_KEY) return { text: null, quotaExceeded: false };
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: 180,
          },
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const status = Number(response.status || 0);
      const errStatus = String(data?.error?.status || '').toUpperCase();
      const message = String(data?.error?.message || '');
      const quotaExceeded =
        status === 429 ||
        errStatus === 'RESOURCE_EXHAUSTED' ||
        message.includes('Quota exceeded');
      if (quotaExceeded) {
        console.warn('Gemini quota exhausted, attempting Groq fallback.');
      } else {
        console.warn('Gemini request failed:', status, message || 'unknown error');
      }
      return { text: null, quotaExceeded };
    }
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts
      .map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('')
      .trim();
    return { text: text || null, quotaExceeded: false };
  } catch (error) {
    console.warn('Gemini call failed:', error.message);
    return { text: null, quotaExceeded: false };
  }
}

async function callGroqGenerate({ systemInstruction, userPrompt }) {
  if (!GROQ_API_KEY) return null;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.55,
        max_tokens: 240,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.warn('Groq request failed:', response.status, data?.error?.message || 'unknown error');
      return null;
    }
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn('Groq call failed:', error.message);
    return null;
  }
}

function cleanBotReply(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isLowQualityBotReply(text) {
  if (!text) return true;
  const value = String(text).trim();
  const lower = value.toLowerCase();
  if (value.length < 6 || value.length > 260) return true;
  if (
    lower.includes('as an ai') ||
    lower.includes('language model') ||
    lower.includes('cannot provide') ||
    lower.includes('i cannot') ||
    lower.includes('policy')
  ) {
    return true;
  }
  return false;
}

function isSimpleGreeting(text) {
  const value = String(text || '').trim().toLowerCase();
  return /^(hi|hii+|hello|hey|heyy+|yo|hola|namaste)[!. ]*$/.test(value);
}

function toSingleSentence(text) {
  const value = String(text || '').trim();
  if (!value) return value;
  const match = value.match(/^[^.!?]+[.!?]/);
  if (match) return match[0].trim();
  return value.split('\n')[0].trim();
}

async function generateBotReply({ botName, botBio, userId, botId, message, type }) {
  const recent = await Message.find({
    $or: [
      { sender: userId, receiver: botId },
      { sender: botId, receiver: userId },
    ],
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const ordered = recent.reverse();
  const lastBotReply = [...ordered].reverse().find((m) => String(m.sender) === String(botId))?.content || '';

  const historyText = ordered
    .slice(-8)
    .map((m) => `${String(m.sender) === String(botId) ? 'Bot' : 'User'}: ${String(m.content || '')}`)
    .join('\n');

  const systemInstruction =
    `You are ${botName}, a friendly dating-chat partner in a mobile app. ` +
    `Write natural human-style English only. ` +
    `Keep replies short: 1 sentence for simple greetings, otherwise 1-2 sentences, max 35 words. ` +
    `Be warm, light, and conversational. Ask one simple follow-up question when relevant. ` +
    `No markdown, no lists, no roleplay labels, no disclaimers, no policy talk, no "as an AI".`;
  const userPrompt =
    `Bot profile bio: ${botBio || 'Friendly and curious.'}\n` +
    `Recent chat:\n${historyText || '(empty)'}\n` +
    `Latest user input (${type}): ${type === 'text' ? String(message || '') : `[${type} message]`}\n` +
    `Reply like a real person chatting in-app. Output only the reply text.`;

  const gemini = await callGeminiGenerate({ systemInstruction, userPrompt });
  if (gemini.text) {
    const cleaned = cleanBotReply(gemini.text);
    if (!isLowQualityBotReply(cleaned)) {
      return isSimpleGreeting(message) ? toSingleSentence(cleaned) : cleaned;
    }
  }

  if (gemini.quotaExceeded) {
    const groqText = await callGroqGenerate({ systemInstruction, userPrompt });
    if (groqText) {
      const cleaned = cleanBotReply(groqText);
      if (!isLowQualityBotReply(cleaned)) {
        return isSimpleGreeting(message) ? toSingleSentence(cleaned) : cleaned;
      }
    }
  }

  return getHeuristicBotReply({ botName, message, type, lastBotReply });
}

async function isBlockedPair(userA, userB) {
  const [aBlockedB, bBlockedA] = await Promise.all([
    User.exists({ _id: userA, blockedUsers: userB }),
    User.exists({ _id: userB, blockedUsers: userA }),
  ]);
  return !!aBlockedB || !!bBlockedA;
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

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user || user.status === 'deleted' || user.status === 'suspended' || user.status === 'banned') {
      return next(new Error('Unauthorized'));
    }

    socket.userId = user._id.toString();
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.join(getUserRoomId(socket.userId));
  User.findByIdAndUpdate(socket.userId, {
    isOnline: true,
    lastActive: new Date(),
  }).catch((err) => console.error('Online status update error:', err.message));
  io.emit('presence_update', { userId: socket.userId, online: true });

  socket.on('join_room', ({ otherUserId }) => {
    if (!otherUserId) return;
    const roomId = getRoomId(socket.userId, otherUserId);
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { receiverId, message, type = 'text', replyTo } = data;
      if (!receiverId || !message) return;
      if (type === 'text' && !String(message).trim()) return;

      const blocked = await isBlockedPair(socket.userId, receiverId);
      if (blocked) {
        socket.emit('message_blocked', {
          error: 'You cannot message this user because one of you has blocked the other.',
        });
        return;
      }

      const matched = await areUsersMatched(socket.userId, receiverId);
      if (!matched) {
        socket.emit('message_blocked', {
          error: 'You can only send messages after both users accept the match request.',
        });
        return;
      }
      
      // AI moderation check
      const moderationInput = type === 'text'
        ? String(message)
        : type === 'audio'
          ? '[audio message]'
          : '[image message]';
      const isSafe = await moderateContent(moderationInput);
      
      if (!isSafe) {
        socket.emit('message_blocked', {
          error: 'Your message contains inappropriate content and was blocked.',
        });
        return;
      }

      const normalizedReplyTo = replyTo?.id ? String(replyTo.id) : undefined;
      const normalizedReplySenderId = replyTo?.senderId ? String(replyTo.senderId) : undefined;

      const savedMessage = await Message.create({
        sender: socket.userId,
        receiver: receiverId,
        content: type === 'text' ? String(message).trim() : String(message),
        type: type === 'image' || type === 'audio' ? type : 'text',
        replyTo: normalizedReplyTo,
        replyMeta: replyTo
          ? {
              text: String(replyTo.text || ''),
              type: replyTo.type || 'text',
              senderId: normalizedReplySenderId,
            }
          : undefined,
        isModerated: true,
      });
      User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        lastActive: new Date(),
      }).catch((err) => console.error('Activity update error:', err.message));

      const roomId = getRoomId(socket.userId, receiverId);
      const senderUserRoom = getUserRoomId(socket.userId);
      const receiverUserRoom = getUserRoomId(receiverId);
      let persistedIsRead = false;
      let persistedReadAt = null;
      try {
        const socketsInRoom = await io.in(roomId).fetchSockets();
        const receiverActiveInRoom = socketsInRoom.some((s) => s.userId === String(receiverId));
        if (receiverActiveInRoom) {
          persistedIsRead = true;
          persistedReadAt = new Date();
          await Message.findByIdAndUpdate(savedMessage._id, {
            $set: { isRead: true, readAt: persistedReadAt },
          });
        }
      } catch (presenceError) {
        console.warn('receiver presence check failed:', presenceError.message);
      }
      const payload = {
        id: savedMessage._id,
        senderId: socket.userId,
        receiverId,
        text: savedMessage.content,
        type: savedMessage.type,
        replyTo: savedMessage.replyTo || null,
        replyMeta: savedMessage.replyMeta || null,
        createdAt: savedMessage.createdAt,
        isRead: persistedIsRead,
        readAt: persistedReadAt,
      };

      // Deliver to all devices of sender and receiver.
      io.to(senderUserRoom).emit('receive_message', payload);
      io.to(receiverUserRoom).emit('receive_message', payload);
      socket.emit('message_saved', payload);

      // Lightweight notification event for non-open chat views.
      io.to(receiverUserRoom).emit('message_notification', {
        receiverId,
        senderId: socket.userId,
        text: savedMessage.content,
        createdAt: savedMessage.createdAt,
      });

      // Bot auto-reply for demo users
      const receiver = await User.findById(receiverId).select('isBot name bio');
      if (receiver?.isBot) {
        const botReplyText = await generateBotReply({
          botName: receiver.name || 'HeartConnect Bot',
          botBio: receiver.bio || '',
          userId: socket.userId,
          botId: receiverId,
          message: savedMessage.content,
          type: savedMessage.type,
        });

        setTimeout(async () => {
          try {
            const botMessage = await Message.create({
              sender: receiverId,
              receiver: socket.userId,
              content: botReplyText,
              type: 'text',
              isModerated: true,
            });

            const botPayload = {
              id: botMessage._id,
              senderId: receiverId,
              receiverId: socket.userId,
              text: botMessage.content,
              type: botMessage.type,
              replyTo: null,
              replyMeta: null,
              createdAt: botMessage.createdAt,
              isRead: false,
            };

            try {
              const socketsInRoom = await io.in(roomId).fetchSockets();
              const humanActiveInRoom = socketsInRoom.some((s) => s.userId === String(socket.userId));
              if (humanActiveInRoom) {
                const readAt = new Date();
                await Message.findByIdAndUpdate(botMessage._id, {
                  $set: { isRead: true, readAt },
                });
                botPayload.isRead = true;
                botPayload.readAt = readAt;
              }
            } catch (presenceError) {
              console.warn('bot read presence check failed:', presenceError.message);
            }

            io.to(getUserRoomId(receiverId)).emit('receive_message', botPayload);
            io.to(getUserRoomId(socket.userId)).emit('receive_message', botPayload);
          } catch (botError) {
            console.error('bot auto-reply error:', botError.message);
          }
        }, 900);
      }
    } catch (error) {
      console.error('send_message error:', error);
      socket.emit('message_error', { error: 'Failed to send message. Please try again.' });
    }
  });

  socket.on('typing', (data) => {
    if (!data?.receiverId) return;
    const roomId = getRoomId(socket.userId, data.receiverId);
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      receiverId: data.receiverId,
      isTyping: data.isTyping !== false,
    });
  });

  socket.on('mark_read', async (data) => {
    try {
      const otherUserId = data?.otherUserId;
      if (!otherUserId) return;

      const readAt = new Date();
      await Message.updateMany(
        { sender: otherUserId, receiver: socket.userId, isRead: false },
        { $set: { isRead: true, readAt } }
      );

      const roomId = getRoomId(socket.userId, otherUserId);
      io.to(roomId).emit('messages_read', {
        readerId: socket.userId,
        otherUserId,
        readAt,
      });
    } catch (error) {
      socket.emit('message_error', { error: 'Failed to mark messages as read.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastActive: new Date(),
    }).catch((err) => console.error('Offline status update error:', err.message));
    io.emit('presence_update', { userId: socket.userId, online: false });
  });
});

// AI Content Moderation Function
async function moderateContent(text) {
  try {
    const value = String(text || '').toLowerCase();
    const blockedTerms = ['kill yourself', 'rape', 'child porn', 'terror attack'];
    return !blockedTerms.some((term) => value.includes(term));
  } catch (error) {
    console.error('Moderation error:', error);
    return true;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for real-time connections`);
});

module.exports = { app, io };
