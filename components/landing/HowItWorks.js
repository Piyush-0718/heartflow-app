'use client'

import { UserPlus, CheckCircle, Heart, MessageCircle } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up & Verify',
      description: 'Create your account with email/phone verification and complete AI selfie matching for authenticity.',
      color: 'from-primary-500 to-primary-600',
      number: '01',
    },
    {
      icon: CheckCircle,
      title: 'Build Your Profile',
      description: 'Add photos, write your bio, answer personality prompts, and set your preferences to attract the right matches.',
      color: 'from-secondary-500 to-secondary-600',
      number: '02',
    },
    {
      icon: Heart,
      title: 'Discover Matches',
      description: 'Browse AI-curated profiles, swipe on people you like, and receive daily personalized match recommendations.',
      color: 'from-pink-500 to-pink-600',
      number: '03',
    },
    {
      icon: MessageCircle,
      title: 'Start Chatting',
      description: 'Connect with your matches through secure, encrypted chat. Use ice-breakers to start meaningful conversations.',
      color: 'from-warm-500 to-warm-600',
      number: '04',
    },
  ]

  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-gray-600">
            Your journey to finding meaningful connections is just four simple steps away.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-pink-200 transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Card */}
                <div className="card text-center group hover:shadow-glow transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 shadow-md">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Desktop Only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a href="/auth/signup" className="btn-primary text-lg px-8 py-4">
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  )
}
