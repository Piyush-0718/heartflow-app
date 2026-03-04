'use client'

import { Shield, Lock, Eye, AlertCircle, FileText, Phone } from 'lucide-react'
import Link from 'next/link'

export default function SafetySection() {
  const safetyFeatures = [
    {
      icon: Shield,
      title: 'AI Content Moderation',
      description: 'Real-time filtering of inappropriate content, hate speech, and suspicious behavior across all profiles and messages.',
    },
    {
      icon: Eye,
      title: '24/7 Human Review',
      description: 'Dedicated moderation team reviews flagged content within 24-36 hours to maintain community standards.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your conversations are encrypted, ensuring your private messages stay private.',
    },
    {
      icon: AlertCircle,
      title: 'Report & Block',
      description: 'Easy-to-access reporting tools and instant blocking to protect yourself from unwanted interactions.',
    },
  ]

  return (
    <section id="safety" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Your Safety is Our Priority
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Date with <span className="gradient-text">Confidence</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We've implemented industry-leading safety measures to create a secure environment where you can focus on finding genuine connections.
            </p>

            <div className="space-y-6 mb-8">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/safety" className="btn-primary">
                Visit Safety Center
              </Link>
              <Link href="/legal/community-guidelines" className="btn-secondary">
                Community Guidelines
              </Link>
            </div>
          </div>

          {/* Right Content - Safety Stats & Info */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">98%</h3>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-700 font-medium">
                Of users feel safe on our platform
              </p>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">&lt;24hrs</h3>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-700 font-medium">
                Average response time for flagged content
              </p>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-700 font-medium">
                Messages are end-to-end encrypted
              </p>
            </div>

            {/* Grievance Contact */}
            <div className="card bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-gray-900">
                  Grievance Officer
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                For any safety concerns or complaints:
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-orange-600" />
                <a
                  href="mailto:grievance@heartconnect.com"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  grievance@heartconnect.com
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Response within 24-36 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
