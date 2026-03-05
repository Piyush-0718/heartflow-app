# HeartConnect - Premium Dating Platform ??

A modern, secure, and elegant dating platform built with safety, trust, and authentic connections at its core.

## ?? Live Deployment
- Frontend (Vercel): https://heartflow-app.vercel.app
- Backend API (Render): https://heartflow-app.onrender.com
- Health Check: https://heartflow-app.onrender.com/api/health

## ? Features

- **Beautiful UI/UX**: Clean, minimal design with smooth animations
- **Advanced Verification**: Email OTP verification for signup
- **Real-time Chat**: Instant messaging with Socket.io
- **Rich Messaging**: Text, images, voice notes, emoji support
- **Chat Intelligence**: Typing indicators, read receipts, unread counts
- **Safety First**: Block/report users + moderation safeguards
- **Match-based Messaging**: Chat is allowed only after accepted/mutual match
- **AI Bot Conversations**: Gemini primary + Groq fallback + safe heuristic fallback
- **Production Hardening**: CORS allowlist, rate limits, readiness/health endpoints

## ?? Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- SMTP/Brevo configuration for OTP emails
- Gemini API key (primary bot replies)
- Groq API key (fallback bot replies)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
Create `.env.local` from `.env.local.example`.

3. **Start backend**
```bash
npm run server
```

4. **Start frontend (new terminal)**
```bash
npm run dev
```

5. **Open app**
```text
http://localhost:3000
```

## ??? Project Structure

```text
heartflow-app/
+-- app/                  # Next.js app routes/pages
+-- components/           # Reusable UI components
+-- server/               # Express API + Socket.io backend
¦   +-- models/           # Mongoose schemas
¦   +-- routes/           # API routes
¦   +-- middleware/       # Auth/security middleware
¦   +-- utils/            # OTP/email/validation helpers
+-- DEPLOYMENT_CHECKLIST.md
+-- README.md
```

## ??? Security & Reliability

- Password hashing with `bcrypt`
- JWT-based authentication
- Helmet security headers
- CORS allowlisting for production origin
- API rate limiting for auth/messages
- DB-aware health and readiness endpoints
- Mobile/deploy chat sync improvements for reconnect scenarios

## ?? Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB Atlas + Mongoose
- **AI**: Gemini + Groq fallback
- **Email OTP**: Brevo SMTP + Brevo API fallback
- **Deployment**: Vercel (frontend), Render (backend)

## ?? Important Environment Variables

```env
MONGODB_URI=...
JWT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000
EMAIL_SERVER=...            # or EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD
EMAIL_FROM=...
BREVO_API_KEY=...           # optional fallback for OTP email via Brevo API
GEMINI_API_KEY=...
GROQ_API_KEY=...
```

## ?? Deployment

- Frontend: Deploy on Vercel
- Backend: Deploy as Render Web Service using `npm run server`
- Follow full checklist: `DEPLOYMENT_CHECKLIST.md`

## ?? Production Smoke Checklist

- Signup -> OTP -> Verify -> Register
- Login
- Match request -> accept
- Real-time chat across two devices
- Read receipts + online status + unread counts
- Block/report actions

## ?? License

Proprietary - All rights reserved.

---

Built with ?? for authentic connections
