'use client'

import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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
            <Heart className="w-10 h-10 text-primary-500 fill-primary-500" />
            <h1 className="text-4xl font-display font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">Last updated: January 15, 2024</p>
        </div>

        {/* Content */}
        <div className="card prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using HeartConnect ("the Platform"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>

          <h2>2. Eligibility</h2>
          <p>You must be at least 18 years old to use HeartConnect. By creating an account, you represent that:</p>
          <ul>
            <li>You are at least 18 years of age</li>
            <li>You have the legal capacity to enter into a binding agreement</li>
            <li>You are not prohibited from using the service under Indian law</li>
            <li>You have not been previously banned from the Platform</li>
          </ul>

          <h2>3. Account Registration</h2>
          <p>To use HeartConnect, you must:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Verify your phone number via OTP</li>
            <li>Complete AI selfie verification</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>

          <h2>4. User Conduct</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Post false, misleading, or fraudulent information</li>
            <li>Impersonate any person or entity</li>
            <li>Upload inappropriate, offensive, or illegal content</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Use the Platform for commercial purposes without permission</li>
            <li>Attempt to circumvent security measures</li>
            <li>Create multiple accounts</li>
            <li>Share explicit or adult content</li>
          </ul>

          <h2>5. Content Moderation</h2>
          <p>
            HeartConnect uses AI-powered moderation and human review to maintain community standards. 
            We reserve the right to remove content and suspend accounts that violate our guidelines.
          </p>

          <h2>6. Verification & Safety</h2>
          <p>
            We implement multi-step verification including phone OTP and AI selfie matching. 
            However, we cannot guarantee the accuracy of all user information. Users are responsible 
            for their own safety when meeting others.
          </p>

          <h2>7. Privacy & Data Protection</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to understand how we 
            collect, use, and protect your personal information in compliance with Indian data protection laws.
          </p>

          <h2>8. Subscription & Payments</h2>
          <p>
            HeartConnect offers both free and premium features. Premium subscriptions are billed 
            according to the plan you choose. All payments are non-refundable unless required by law.
          </p>

          <h2>9. Intellectual Property</h2>
          <p>
            All content, trademarks, and intellectual property on HeartConnect are owned by us or 
            our licensors. You may not use, copy, or distribute any content without permission.
          </p>

          <h2>10. Termination</h2>
          <p>We may suspend or terminate your account if you:</p>
          <ul>
            <li>Violate these Terms of Service</li>
            <li>Violate Community Guidelines</li>
            <li>Engage in fraudulent activity</li>
            <li>Receive multiple reports from other users</li>
          </ul>

          <h2>11. Limitation of Liability</h2>
          <p>
            HeartConnect is provided "as is" without warranties. We are not liable for any damages 
            arising from your use of the Platform, including but not limited to interactions with other users.
          </p>

          <h2>12. Dispute Resolution</h2>
          <p>
            Any disputes arising from these terms shall be resolved through arbitration in accordance 
            with Indian law. The jurisdiction shall be Mumbai, Maharashtra.
          </p>

          <h2>13. Grievance Redressal</h2>
          <p>
            For complaints or grievances, please contact our Grievance Officer at:
            <br />
            Email: grievance@heartconnect.com
            <br />
            Response time: 24-36 hours
          </p>

          <h2>14. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will notify you of significant 
            changes via email or in-app notification. Continued use of the Platform constitutes acceptance 
            of updated terms.
          </p>

          <h2>15. Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us at:
            <br />
            Email: legal@heartconnect.com
            <br />
            Address: Mumbai, Maharashtra, India
          </p>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mt-8">
            <p className="text-sm text-gray-700 mb-0">
              <strong>Compliance Notice:</strong> HeartConnect operates in compliance with the Information 
              Technology Act, 2000, IT Rules 2021, and applicable Indian data protection regulations.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
            Privacy Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/legal/community-guidelines" className="text-primary-600 hover:text-primary-700 font-medium">
            Community Guidelines
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/legal/grievance" className="text-primary-600 hover:text-primary-700 font-medium">
            Grievance Redressal
          </Link>
        </div>
      </div>
    </div>
  )
}
