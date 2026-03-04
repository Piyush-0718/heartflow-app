'use client'

import Link from 'next/link'
import { Heart, ArrowLeft, Shield, Lock, Eye, Download } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-10 h-10 text-green-500" />
            <h1 className="text-4xl font-display font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: January 15, 2024</p>
        </div>

        {/* Quick Summary */}
        <div className="card bg-gradient-to-r from-green-50 to-blue-50 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Privacy Matters</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Encrypted</p>
                <p className="text-sm text-gray-600">End-to-end encryption for all messages</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Eye className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Transparent</p>
                <p className="text-sm text-gray-600">Clear data usage policies</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Download className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Your Data</p>
                <p className="text-sm text-gray-600">Download or delete anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card prose prose-lg max-w-none">
          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email, phone number, date of birth, gender</li>
            <li><strong>Profile Information:</strong> Photos, bio, interests, occupation, education</li>
            <li><strong>Verification Data:</strong> Phone OTP, selfie photos for AI verification</li>
            <li><strong>Communications:</strong> Messages, reports, support requests</li>
          </ul>

          <h3>1.2 Automatically Collected Information</h3>
          <ul>
            <li><strong>Device Information:</strong> IP address, device type, operating system</li>
            <li><strong>Usage Data:</strong> Pages viewed, features used, time spent</li>
            <li><strong>Location Data:</strong> Approximate location (with your consent)</li>
            <li><strong>Cookies:</strong> Session data, preferences</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our dating services</li>
            <li>To verify your identity and prevent fraud</li>
            <li>To match you with compatible users</li>
            <li>To moderate content and ensure safety</li>
            <li>To communicate important updates</li>
            <li>To analyze platform usage and improve features</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>3. AI & Content Moderation</h2>
          <p>
            We use AI technology (including OpenAI APIs) to:
          </p>
          <ul>
            <li>Verify profile photos match selfies</li>
            <li>Detect inappropriate content in messages and profiles</li>
            <li>Generate compatibility scores</li>
            <li>Flag potential safety concerns</li>
          </ul>
          <p>
            All AI processing is done securely and in compliance with data protection standards.
          </p>

          <h2>4. Data Sharing & Disclosure</h2>
          <p>We do NOT sell your personal data. We may share information with:</p>
          <ul>
            <li><strong>Other Users:</strong> Profile information visible to matches</li>
            <li><strong>Service Providers:</strong> Cloud hosting, payment processing, analytics</li>
            <li><strong>Legal Authorities:</strong> When required by law or to prevent harm</li>
            <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures:</p>
          <ul>
            <li>End-to-end encryption for messages</li>
            <li>Secure SSL/TLS connections</li>
            <li>Password hashing with bcrypt</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
          </ul>

          <h2>6. Your Privacy Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Correction:</strong> Update incorrect information</li>
            <li><strong>Deletion:</strong> Delete your account and data</li>
            <li><strong>Portability:</strong> Download your data in a portable format</li>
            <li><strong>Objection:</strong> Opt-out of certain data processing</li>
            <li><strong>Restriction:</strong> Limit how we use your data</li>
          </ul>

          <h2>7. Data Retention</h2>
          <ul>
            <li><strong>Active Accounts:</strong> Data retained while account is active</li>
            <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days</li>
            <li><strong>Legal Requirements:</strong> Some data retained for compliance (e.g., reports)</li>
            <li><strong>Backups:</strong> May persist in backups for up to 90 days</li>
          </ul>

          <h2>8. Children's Privacy</h2>
          <p>
            HeartConnect is strictly for users 18 years and older. We do not knowingly collect 
            information from minors. If we discover a minor has created an account, we will 
            immediately delete it.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your data is primarily stored in India. If transferred internationally, we ensure 
            adequate protection through standard contractual clauses and compliance with applicable laws.
          </p>

          <h2>10. Cookies & Tracking</h2>
          <p>We use cookies for:</p>
          <ul>
            <li>Authentication and security</li>
            <li>Preferences and settings</li>
            <li>Analytics and performance</li>
          </ul>
          <p>You can control cookies through your browser settings.</p>

          <h2>11. Third-Party Services</h2>
          <p>We integrate with:</p>
          <ul>
            <li><strong>OpenAI:</strong> Content moderation and AI features</li>
            <li><strong>Twilio:</strong> SMS verification</li>
            <li><strong>Payment Processors:</strong> Secure payment handling</li>
          </ul>
          <p>Each service has its own privacy policy.</p>

          <h2>12. Changes to Privacy Policy</h2>
          <p>
            We may update this policy periodically. Significant changes will be communicated via 
            email or in-app notification. Continued use after changes constitutes acceptance.
          </p>

          <h2>13. Contact & Grievances</h2>
          <p>
            For privacy concerns or to exercise your rights:
            <br />
            <strong>Email:</strong> privacy@heartconnect.com
            <br />
            <strong>Grievance Officer:</strong> grievance@heartconnect.com
            <br />
            <strong>Response Time:</strong> 24-36 hours
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
            <p className="text-sm text-gray-700 mb-0">
              <strong>Compliance:</strong> This Privacy Policy complies with the Information Technology Act, 2000, 
              IT Rules 2021, and the Digital Personal Data Protection Act guidelines.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/legal/terms" className="text-primary-600 hover:text-primary-700 font-medium">
            Terms of Service
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/legal/community-guidelines" className="text-primary-600 hover:text-primary-700 font-medium">
            Community Guidelines
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/profile/settings" className="text-primary-600 hover:text-primary-700 font-medium">
            Privacy Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
