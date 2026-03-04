'use client'

import Link from 'next/link'
import { Heart, ArrowLeft, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building a respectful, safe, and authentic dating community for everyone
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 mb-10 border border-primary-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            HeartConnect is committed to creating a safe, respectful, and authentic environment where 
            people can find meaningful connections. These guidelines help maintain a positive community 
            for everyone.
          </p>
        </div>

        {/* What We Encourage */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-7 h-7 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">What We Encourage</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Be Authentic', desc: 'Use real photos and honest information' },
              { title: 'Be Respectful', desc: 'Treat others with kindness and dignity' },
              { title: 'Be Safe', desc: 'Protect your personal information' },
              { title: 'Be Genuine', desc: 'Engage in meaningful conversations' },
              { title: 'Be Positive', desc: 'Create a welcoming atmosphere' },
              { title: 'Be Considerate', desc: 'Respect boundaries and preferences' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Not Allowed */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-7 h-7 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">What's Not Allowed</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                title: '1. Inappropriate Content',
                items: ['Nudity or sexually explicit content', 'Pornographic material', 'Suggestive or provocative photos', 'Content promoting adult services'],
                highlight: true
              },
              {
                title: '2. Harassment & Abuse',
                items: ['Bullying, threatening, or intimidating behavior', 'Unwanted sexual advances or comments', 'Stalking or persistent unwanted contact', 'Sharing private conversations without consent']
              },
              {
                title: '3. Hate Speech & Discrimination',
                items: ['Content promoting hatred based on race, religion, caste, gender, or sexual orientation', 'Discriminatory language or slurs', 'Content inciting violence or harm']
              },
              {
                title: '4. Fake Profiles & Impersonation',
                items: ['Using someone else\'s photos or identity', 'Creating multiple accounts', 'Providing false information about age, location, or identity', 'Catfishing or deceptive practices']
              },
              {
                title: '5. Scams & Fraud',
                items: ['Requesting money or financial information', 'Promoting pyramid schemes or scams', 'Phishing attempts', 'Commercial solicitation without permission']
              },
              {
                title: '6. Illegal Activities',
                items: ['Promoting or engaging in illegal activities', 'Drug-related content', 'Weapons or violence', 'Human trafficking or exploitation']
              },
              {
                title: '7. Spam & Misuse',
                items: ['Sending repetitive or unsolicited messages', 'Promoting external websites or services', 'Bot accounts or automated behavior', 'Manipulating the matching algorithm']
              }
            ].map((section, idx) => (
              <div key={idx} className={`p-5 rounded-xl border-2 ${section.highlight ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <Shield className="w-7 h-7 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Safety Guidelines</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Protect Your Privacy</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Do not share phone number or address early</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Use in-app chat until comfortable</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Be cautious about social media</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Never send money to strangers</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Meeting in Person</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Meet in public places first</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Tell someone your plans</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Arrange your own transport</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Trust your instincts</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Red Flags</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Requests for money</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Avoiding video calls</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Inconsistent stories</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">•</span>Aggressive behavior</li>
                </ul>
              </div>
            </div>
          </div>

        {/* Enforcement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enforcement & Consequences</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">1</div>
              <p className="font-bold text-gray-900 mb-2">Warning</p>
              <p className="text-sm text-gray-700">Minor violations receive a warning and content removal</p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">2</div>
              <p className="font-bold text-gray-900 mb-2">Temporary Suspension</p>
              <p className="text-sm text-gray-700">7-30 day suspension for repeated violations</p>
            </div>

            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">3</div>
              <p className="font-bold text-gray-900 mb-2">Permanent Ban</p>
              <p className="text-sm text-gray-700">Serious violations lead to account termination</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Appeal Process</h3>
            <p className="text-sm text-gray-700">
              If you believe your account was suspended or banned in error, contact our Grievance Officer at 
              <a href="mailto:grievance@heartconnect.com" className="text-primary-600 hover:text-primary-700 font-medium"> grievance@heartconnect.com</a> within 7 days.
            </p>
          </div>
        </div>

        {/* Reporting */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reporting Violations</h2>
          <p className="text-gray-700 mb-6">Help us maintain a safe community by reporting violations promptly.</p>
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">How to Report:</h3>
            <div className="space-y-3">
              {[
                'Click the Report button on any profile or message',
                'Select the reason for reporting',
                'Provide additional details if needed',
                'Our team will review within 24-36 hours'
              ].map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                  <p className="text-sm text-gray-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing Message */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center border border-primary-100 shadow-sm">
          <Heart className="w-14 h-14 text-primary-500 fill-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You for Being Part of HeartConnect</h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Remember, behind every profile is a real person with feelings. Together, we can create a dating platform 
            that's safe, respectful, and full of genuine connections where everyone feels valued and diversity is celebrated.
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/legal/terms" className="text-primary-600 hover:text-primary-700 font-medium">
            Terms of Service
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
            Privacy Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/safety" className="text-primary-600 hover:text-primary-700 font-medium">
            Safety Center
          </Link>
        </div>
      </div>
    </div>
  )
}
