# HeartConnect Deployment Checklist

Use this checklist before inviting 10-50 test users.

## 1. Environment and Secrets
- Create a production env file on your host (do not commit it).
- Set strong secrets:
  - `JWT_SECRET` (32+ random chars)
  - `MONGODB_URI` (production Atlas URI)
  - `GEMINI_API_KEY`, `GROQ_API_KEY` (if bot enabled)
  - SMTP credentials (`EMAIL_SERVER` or `EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD`)
- Set app URLs:
  - `FRONTEND_URL=https://your-frontend-domain`
  - `FRONTEND_ORIGINS=https://your-frontend-domain`
  - `NEXT_PUBLIC_API_URL=https://your-api-domain`
  - `NEXT_PUBLIC_SOCKET_URL=https://your-api-domain`
- Set `NODE_ENV=production`.

## 2. MongoDB Atlas
- Use a dedicated production project/cluster.
- Add database user with least privilege.
- Configure Network Access:
  - Allow backend host IP(s), not broad public access if avoidable.
- Enable backups and alerting.

## 3. Media Storage (recommended before real users)
- Do not keep large base64 media in database long term.
- Use cloud object/media storage and store only URLs.
- Recommended options:
  - Cloudinary (fast setup)
  - S3/R2 (lower long-term cost, more control)

## 4. Deploy Services
- Frontend: Vercel (Next.js).
- Backend (Express + Socket.io): Render / Railway / Fly.io.
- Ensure backend runs continuously (not serverless function for sockets).

## 5. Security Baseline
- Confirm CORS allowlist is production-only domain.
- Confirm `/api/health` and `/api/ready` work.
- Confirm rate limits:
  - Auth endpoints limited
  - Message endpoints limited
- Ensure HTTPS is enabled on frontend and backend domains.

## 6. Email/OTP Validation
- Test send OTP and verify OTP using production SMTP.
- Confirm `EMAIL_FROM` is valid/sender-verified on provider.
- Validate message deliverability in inbox and spam folder.

## 7. Smoke Tests (must pass)
- Signup -> OTP -> Register
- Login/logout
- Match request -> accept -> chat
- Real-time messages with two users
- Read receipts + unread count + online status
- Block/report flow
- Bot chat with Gemini/Groq fallback

## 8. Monitoring and Ops
- Add error monitoring (Sentry recommended).
- Add uptime checks for:
  - Frontend URL
  - `/api/health`
  - `/api/ready`
- Retain backend logs for debugging.

## 9. Rollout Plan
- Start with 10 internal testers.
- Monitor errors and DB/AI quota.
- Expand to 25, then 50 users after stability.

## 10. Fast Validation Commands
```bash
curl https://your-api-domain/api/health
curl https://your-api-domain/api/ready
```

Expected:
- `health` returns `status: ok` and `db: connected`.
- `ready` returns `status: ready`.
