const nodemailer = require('nodemailer');

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

function getMailTransporter() {
  if (process.env.EMAIL_SERVER) {
    return nodemailer.createTransport(process.env.EMAIL_SERVER);
  }

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return null;
}

// Send OTP via email
const sendOTP = async (email) => {
  try {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const otp = generateOTP();
    
    // Store OTP with expiry (5 minutes)
    otpStore.set(normalizedEmail, {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    });

    const transporter = getMailTransporter();

    // Send email when SMTP is configured
    if (process.env.NODE_ENV === 'production') {
      if (!transporter || !process.env.EMAIL_FROM) {
        throw new Error('Email SMTP is not configured for production OTP delivery');
      }
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: normalizedEmail,
        subject: 'HeartConnect Email Verification OTP',
        text: `Your HeartConnect verification code is ${otp}. It is valid for 5 minutes.`,
      });
      return { sent: true };
    }

    // Development mode: try email if configured; fallback to dev OTP if send fails.
    if (transporter && process.env.EMAIL_FROM) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: normalizedEmail,
          subject: 'HeartConnect Email Verification OTP',
          text: `Your HeartConnect verification code is ${otp}. It is valid for 5 minutes.`,
        });
        return { sent: true };
      } catch (mailError) {
        console.warn('SMTP send failed in development, falling back to dev OTP:', mailError.message);
      }
    }

    console.log(`OTP for ${normalizedEmail}: ${otp}`);
    return { sent: true, devOtp: otp };
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const stored = otpStore.get(normalizedEmail);

    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expiry) {
      otpStore.delete(normalizedEmail);
      return false;
    }

    if (stored.otp !== otp) {
      return false;
    }

    // OTP is valid, remove it
    otpStore.delete(normalizedEmail);
    return true;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return false;
  }
};

module.exports = { sendOTP, verifyOTP };
