# HeartConnect 💕

<p align="center">
  <b>Real People. Real Connections. Safe Conversations.</b><br/>
  Full-stack dating app with secure onboarding, real-time messaging, and AI-assisted chat.
</p>

<p align="center">
  <a href="https://heartflow-app.vercel.app"><img src="https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel"/></a>
  <a href="https://heartflow-app.onrender.com/api/health"><img src="https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=000"/></a>
  <img src="https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs"/>
  <img src="https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socketdotio"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=fff"/>
</p>

## Live
- Frontend: https://heartflow-app.vercel.app
- Backend API: https://heartflow-app.onrender.com
- Health: https://heartflow-app.onrender.com/api/health

## What This Project Includes
- Email OTP signup + JWT authentication
- Match-gated chat (chat only after accepted/mutual match)
- Real-time chat with Socket.io
- Typing indicator, read receipts, unread counts, online status
- Rich chat content: text, image, voice note, emojis
- Safety controls: block/report + moderation checks
- AI bot chat: Gemini primary, Groq fallback, heuristic fallback
- Production-ready backend hardening (CORS allowlist, rate limits, health/ready endpoints)

## Tech Stack
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Node.js, Express, Socket.io
- Database: MongoDB Atlas + Mongoose
- Email: Brevo SMTP (+ API fallback)
- AI: Gemini + Groq
- Deploy: Vercel (frontend), Render (backend)

## Quick Start
```bash
npm install
npm run server
# in a new terminal
npm run dev
```
Open `http://localhost:3000`

## Required Environment Variables
```env
MONGODB_URI=...
JWT_SECRET=...

NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000

EMAIL_SERVER=...           # or EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD
EMAIL_FROM=...
BREVO_API_KEY=...          # optional API fallback

GEMINI_API_KEY=...
GROQ_API_KEY=...
```

## Deployment Notes
- Frontend: Vercel
- Backend: Render Web Service (`npm run server`)
- Full checklist: `DEPLOYMENT_CHECKLIST.md`

## Smoke Test Checklist
- Signup -> OTP -> Verify -> Register
- Login
- Match -> Accept -> Chat
- Real-time sync on two devices
- Read receipts and unread updates
- Block/report flow

---
Built with ❤️ for authentic connections.
