const validator = require('validator');

// Email validation
const validateEmail = (email) => {
  if (!email || !validator.isEmail(email)) {
    return false;
  }

  // Block disposable email domains
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
  ];

  const domain = email.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return false;
  }

  return true;
};

// Phone validation (Indian format)
const validatePhone = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a valid 10-digit Indian number
  if (cleaned.length !== 10) {
    return false;
  }

  // Check if it starts with valid digits (6-9)
  if (!/^[6-9]/.test(cleaned)) {
    return false;
  }

  return true;
};

// Password strength validation
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
};

// Sanitize user input
const sanitizeInput = (input) => {
  return validator.escape(input.trim());
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  sanitizeInput,
};
