# HeartConnect - Premium Dating Platform 💕

A modern, secure, and elegant dating platform built with safety, trust, and authentic connections at its core.

## ✨ Features

- **Beautiful UI/UX**: Clean, minimal design with smooth animations
- **AI-Powered Matching**: Smart compatibility suggestions based on interests and preferences
- **Advanced Verification**: Email/Phone OTP + AI selfie verification
- **Real-time Chat**: Secure messaging with AI moderation
- **Safety First**: Content moderation, reporting system, and grievance handling
- **Privacy Controls**: End-to-end encryption, data export/deletion
- **Admin Dashboard**: Comprehensive moderation and analytics tools
- **Indian Compliance**: Follows IT Rules 2021 and data protection guidelines

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Gemini API key (primary bot replies)
- Groq API key (fallback bot replies, optional)
- SMTP provider credentials (for email OTP)

### Installation

1. **Clone and install dependencies**
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

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

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

```
heartconnect-dating/
├── app/                    # Next.js app directory
│   ├── page.js            # Landing page
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile pages
│   ├── matches/           # Matching interface
│   ├── chat/              # Chat system
│   ├── admin/             # Admin dashboard
│   └── legal/             # Legal pages
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── auth/             # Auth components
│   ├── profile/          # Profile components
│   ├── matching/         # Matching components
│   └── chat/             # Chat components
├── server/               # Backend API
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── lib/                 # Frontend utilities
├── styles/              # Global styles
└── public/              # Static assets
```

## 🛡️ Security Features

- **Encryption**: bcrypt for passwords, JWT for sessions
- **AI Moderation**: Local heuristic filtering + AI provider guardrails
- **Rate Limiting**: Prevents abuse and spam
- **CORS Protection**: Configured for production
- **Helmet.js**: Security headers
- **Input Validation**: Server-side validation for all inputs
- **SSL/TLS**: HTTPS enforced in production

## 📱 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **AI**: Gemini API (+ Groq fallback)

## Deployment

Before production launch, follow `DEPLOYMENT_CHECKLIST.md`.
- **Authentication**: JWT + OTP
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion

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

Proprietary - All rights reserved

## 🆘 Support

For issues or questions, contact the development team or refer to the documentation.

---

Built with ❤️ for authentic connections
