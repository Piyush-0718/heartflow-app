'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Mail, Phone, Lock, User, ArrowRight, Shield, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  })
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [verificationToken, setVerificationToken] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter email first')
      return
    }

    try {
      setIsSendingOtp(true)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      const response = await fetch(`${apiBase}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Failed to send OTP')
        return
      }

      setOtpSent(true)
      toast.success(data.devOtp ? `OTP (dev): ${data.devOtp}` : 'OTP sent to your email!')
    } catch (error) {
      if (error?.name === 'AbortError') {
        toast.error('OTP request timed out. Check API URL/back-end status.')
      } else {
        toast.error('Unable to send OTP. Check backend setup.')
      }
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      setIsVerifyingOtp(true)
      const response = await fetch(`${apiBase}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          otp,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'OTP verification failed')
        return
      }

      setVerificationToken(data.verificationToken || '')
      toast.success('Email verified successfully!')
      setStep(2)
    } catch (error) {
      toast.error('Unable to verify OTP. Check backend setup.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      toast.error('Please agree to Terms and Privacy Policy')
      return
    }
    if (!verificationToken) {
      toast.error('Please verify your email first')
      return
    }

    try {
      setIsCreatingAccount(true)
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.replace(/\D/g, ''),
          password: formData.password,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          verificationToken,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Account creation failed')
        return
      }

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      toast.success('Account created! Redirecting to profile setup...')
      setTimeout(() => {
        window.location.href = '/profile/setup'
      }, 800)
    } catch (error) {
      toast.error('Unable to create account. Check backend setup.')
    } finally {
      setIsCreatingAccount(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-400"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
            <Heart className="w-10 h-10 text-primary-500 fill-primary-500 group-hover:scale-110 transition-transform" />
            <span className="text-3xl font-display font-bold gradient-text">
              HeartConnect
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Join thousands finding meaningful connections
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Verify</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">Details</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          {step === 1 ? (
            /* Step 1: Phone Verification */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input-field flex-1"
                    disabled={otpSent}
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpSent || isSendingOtp}
                    className="btn-primary whitespace-nowrap"
                  >
                    {otpSent ? 'Sent' : isSendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="animate-slide-down">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength="6"
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={isVerifyingOtp}
                    className="btn-primary w-full mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                </div>
              )}

              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p>Your email will be verified via OTP for security purposes.</p>
              </div>
            </div>
          ) : (
            /* Step 2: Account Details */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly
                  className="input-field bg-gray-100"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  className="input-field"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                  className="input-field"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Re-enter password"
                />
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/legal/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </Link>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/legal/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isCreatingAccount}
                className="btn-primary w-full group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCreatingAccount ? 'Creating...' : 'Create Account'}
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
