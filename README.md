# HeartFlow App

Real-time dating and social matching platform with secure onboarding, live chat, safety controls, and AI-assisted demo conversations.

## Live Links
- Frontend (Vercel): https://heartflow-app.vercel.app
- Backend API (Render): https://heartflow-app.onrender.com
- Health Check: https://heartflow-app.onrender.com/api/health

## Core Features
- Email OTP signup and JWT authentication
- Real-time chat with Socket.io (text, image, voice note, emoji)
- Read receipts, typing indicator, online presence
- Match gating (chat only after mutual/accepted match)
- Block and report flow with backend moderation routes
- AI bot chat with provider fallback (Gemini primary, Groq fallback, heuristic fallback)
- Message reply threading and chat clear options
- Deployment-ready backend hardening (CORS allowlist, rate limits, health/readiness)

## Tech Stack
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Node.js, Express, Socket.io
- Database: MongoDB Atlas + Mongoose
- Auth/Security: JWT, bcrypt, Helmet, CORS, rate limiting
- Email OTP: Brevo SMTP (+ Brevo API fallback)
- AI: Gemini + Groq fallback

## Architecture
- Frontend UI served via Vercel.
- Backend API + WebSocket server hosted on Render.
- MongoDB Atlas for user, match, message, and report data.
- Frontend communicates with backend using:
  - REST APIs (`/api/*`)
  - Socket events (`send_message`, `receive_message`, `typing`, `messages_read`)

## Local Setup
1. Install dependencies:
```bash
npm install
```
2. Create `.env.local` from `.env.local.example` and fill values.
3. Start backend:
```bash
npm run server
```
4. Start frontend in another terminal:
```bash
npm run dev
```
5. Open:
```text
http://localhost:3000
```

## Environment Variables (Essential)
```env
MONGODB_URI=...
JWT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
FRONTEND_ORIGINS=http://localhost:3000
EMAIL_SERVER=...
EMAIL_FROM=...
GEMINI_API_KEY=...
GROQ_API_KEY=...
```

## Deployment
- Frontend: Vercel
- Backend: Render Web Service (`npm run server`)
- Production checklist: `DEPLOYMENT_CHECKLIST.md`

## Notes
- Render free tier can sleep on inactivity, causing first request delay.
- For production traffic, move media to cloud storage (Cloudinary/S3/R2) and keep only URLs in DB.
