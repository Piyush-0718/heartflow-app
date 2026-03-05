# HeartConnect - Premium Dating Platform 💕

A modern, secure, and elegant dating platform built with safety, trust, and authentic connections at its core.

## 🌐 Live Deployment
- Frontend (Vercel): https://heartflow-app.vercel.app
- Backend API (Render): https://heartflow-app.onrender.com
- Health Check: https://heartflow-app.onrender.com/api/health

## ✨ Features

- **Beautiful UI/UX**: Clean, minimal design with smooth animations
- **Advanced Verification**: Email OTP-based signup verification
- **Real-time Chat**: Instant messaging via Socket.io
- **Rich Messaging**: Text, images, voice notes, and emojis
- **Chat Intelligence**: Typing indicator, read receipts, unread counters, online status
- **Safety First**: Block/report user flow and moderation checks
- **Match-Gated Messaging**: Chat unlocks only after accepted/mutual match
- **AI Chat Companion**: Gemini primary replies with Groq + heuristic fallback
- **Deployment Hardening**: CORS allowlist, route rate limits, health/readiness checks

## 🧱 Architecture

```text
Client (Next.js @ Vercel)
  ├─ Auth UI (Signup/Login)
  ├─ Matches UI
  ├─ Chat UI (Socket + REST fallback sync)
  └─ Legal/Admin screens

Backend (Node/Express + Socket.io @ Render)
  ├─ /api/auth       (OTP, register, login)
  ├─ /api/matches    (like, super-like, accept/reject)
  ├─ /api/messages   (conversations, read, clear)
  ├─ /api/reports    (report/block/unblock)
  ├─ /api/health     (service + DB status)
  └─ /api/ready      (readiness probe)

Data + Services
  ├─ MongoDB Atlas (users, matches, messages, reports)
  ├─ Brevo (OTP email via SMTP/API fallback)
  ├─ Gemini (primary AI bot response)
  └─ Groq (fallback AI bot response)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key (primary bot replies)
- Groq API key (fallback bot replies, optional)
- SMTP provider credentials (for email OTP)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/heartconnect

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Gemini (primary bot replies)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Groq (fallback when Gemini quota is exhausted)
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant

# Email OTP
EMAIL_SERVER=your-email-server-url
EMAIL_FROM=your-verified-sender@example.com
BREVO_API_KEY=your-brevo-api-key

# App Config
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000
TRUST_PROXY=1
```

3. **Start the backend server**
```bash
npm run server
```

4. **Start the frontend (in a new terminal)**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```text
heartflow-app/
├── app/                    # Next.js app directory
│   ├── page.js            # Landing page
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile pages
│   ├── matches/           # Matching interface
│   ├── chat/              # Chat system
│   ├── admin/             # Admin dashboard
│   └── legal/             # Legal pages
├── components/            # Reusable React components
├── server/                # Backend API + sockets
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation
│   └── utils/             # Email/OTP/helpers
├── DEPLOYMENT.md
├── DEPLOYMENT_CHECKLIST.md
└── README.md
```

## 🛡️ Security Features

- **Encryption**: bcrypt for passwords, JWT for sessions
- **AI Moderation**: Local heuristic filtering + provider guardrails
- **Rate Limiting**: Route-level throttling for auth/messages
- **CORS Protection**: Production origin allowlisting
- **Helmet.js**: Security headers
- **Input Validation**: Server-side validation for all inputs
- **SSL/TLS**: HTTPS in production deployment

## 📱 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **AI**: Gemini API (+ Groq fallback)
- **Email**: Brevo SMTP + Brevo API fallback
- **Deployment**: Vercel (frontend), Render (backend)

## 🚢 Deployment

Before production launch, follow `DEPLOYMENT_CHECKLIST.md`.

- Frontend deploy: Vercel project connected to GitHub
- Backend deploy: Render Web Service (`npm run server`)
- Required production env: `MONGODB_URI`, strong `JWT_SECRET`, `FRONTEND_URL`, `FRONTEND_ORIGINS`
- Smoke test: signup -> OTP -> login -> match -> chat on two devices

## 🎨 Design Philosophy

- Warm, inviting color palette (soft pinks, purples, and corals)
- Smooth micro-interactions and transitions
- Mobile-first responsive design
- Accessibility-focused (WCAG 2.1 AA)
- Human-centered copy and messaging

## 📋 Compliance

This platform follows:
- IT Rules 2021 (India)
- Digital Personal Data Protection Act guidelines
- Safe Harbor provisions for intermediaries
- Grievance redressal mechanisms

## 🤝 Contributing

This is a production-ready template. Customize as needed for your specific requirements.

## 📄 License

Proprietary - All rights reserved.

## 🆘 Support

For issues or questions, contact the development team or refer to the documentation.

---

Built with ❤️ for authentic connections
