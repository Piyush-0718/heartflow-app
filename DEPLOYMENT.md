# HeartConnect Deployment Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- OpenAI API key
- Twilio account (for SMS OTP)
- Email service (Gmail/SendGrid)

## Environment Setup

1. **Copy the environment template:**
```bash
cp .env.local.example .env.local
```

2. **Configure your environment variables:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/heartconnect
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heartconnect

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# OpenAI API (for AI moderation)
OPENAI_API_KEY=sk-your-openai-api-key

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# App URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start MongoDB** (if running locally):
```bash
mongod
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
npm run server
```
This starts the Express server on port 3001.

2. **Start the frontend** (in a new terminal):
```bash
npm run dev
```
This starts Next.js on port 3000.

3. **Open your browser:**
```
http://localhost:3000
```

### Production Mode

1. **Build the frontend:**
```bash
npm run build
```

2. **Start both servers:**
```bash
npm start
npm run server
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Backend (Railway/Render):**
1. Create new service
2. Connect GitHub repo
3. Set build command: `npm install`
4. Set start command: `node server/index.js`
5. Add environment variables
6. Deploy

### Option 2: AWS/DigitalOcean

1. Set up Ubuntu server
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Configure PM2 for process management:
```bash
npm install -g pm2
pm2 start server/index.js --name heartconnect-api
pm2 start npm --name heartconnect-web -- start
pm2 save
pm2 startup
```

### Option 3: Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000 3001
CMD ["npm", "start"]
```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in .env.local

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu:
sudo apt-get install mongodb

# macOS:
brew install mongodb-community

# Start MongoDB
mongod --dbpath /path/to/data
```

## API Keys Setup

### OpenAI API
1. Go to platform.openai.com
2. Create API key
3. Add to OPENAI_API_KEY

### Twilio
1. Sign up at twilio.com
2. Get Account SID and Auth Token
3. Get a phone number
4. Add credentials to .env.local

### Email (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password
3. Use in EMAIL_PASSWORD

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly
- [ ] Configure rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables (never commit .env files)
- [ ] Set up backup strategy
- [ ] Configure firewall rules
- [ ] Enable logging and monitoring

## Performance Optimization

1. **Enable caching:**
   - Redis for session storage
   - CDN for static assets

2. **Database indexing:**
   - Already configured in models
   - Monitor slow queries

3. **Image optimization:**
   - Use Cloudinary or AWS S3
   - Implement lazy loading

4. **Load balancing:**
   - Use Nginx or AWS ALB
   - Scale horizontally as needed

## Monitoring

1. **Application monitoring:**
   - Use PM2 monitoring
   - Set up error tracking (Sentry)

2. **Database monitoring:**
   - MongoDB Atlas monitoring
   - Set up alerts

3. **Logs:**
   - Centralized logging (Loggly, Papertrail)
   - Regular log rotation

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### MongoDB connection issues
- Check if MongoDB is running
- Verify connection string
- Check network/firewall settings

### Build errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## Support

For deployment issues:
- Email: support@heartconnect.com
- Documentation: Check README.md

## Compliance Notes

- Ensure HTTPS in production
- Configure data retention policies
- Set up regular backups
- Implement audit logging
- Follow IT Rules 2021 guidelines
