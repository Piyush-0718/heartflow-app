'use client'

import { 
  Shield, UserCheck, MessageCircle, Sparkles, 
  Lock, Eye, Zap, Heart, Award, Bell 
} from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Safety',
      description: 'Advanced AI moderation filters inappropriate content, hate speech, and suspicious behavior in real-time.',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: UserCheck,
      title: 'Verified Profiles',
      description: 'Multi-step verification including email, phone OTP, and AI selfie matching ensures authentic users only.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Sparkles,
      title: 'Smart Matching',
      description: 'Our AI analyzes interests, preferences, and compatibility to suggest the most relevant matches for you.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      icon: MessageCircle,
      title: 'Secure Chat',
      description: 'End-to-end encrypted messaging with built-in ice-breakers and emoji reactions for engaging conversations.',
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Complete control over your data with options to download, delete, and manage who sees your information.',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      icon: Eye,
      title: 'Content Moderation',
      description: 'Dedicated team reviews flagged content within 24-36 hours, maintaining a safe community environment.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Swipe through curated profiles and get instant matches based on mutual interest and compatibility.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Heart,
      title: 'Personality Prompts',
      description: 'Showcase your true self with fun prompts like "Two truths and a lie" and "My perfect weekend".',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Stay updated with intelligent notifications about new matches, messages, and profile views.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <section id="features" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">HeartConnect</span>?
          </h2>
          <p className="text-xl text-gray-600">
            We've built the most comprehensive safety and matching features to help you find genuine connections.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-hover group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-secondary-50 px-8 py-4 rounded-2xl shadow-soft">
            <Award className="w-6 h-6 text-primary-500" />
            <span className="text-gray-700 font-semibold">
              Compliant with IT Rules 2021 & Indian Data Protection Guidelines
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
