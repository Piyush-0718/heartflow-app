'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Sparkles, ArrowRight, Shield, Users } from 'lucide-react'

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const words = ['Authentic', 'Meaningful', 'Safe', 'Real']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-400"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-warm-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-600"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 px-4">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-soft animate-slide-down">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-semibold text-gray-700">
              India's Most Trusted Dating Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight animate-slide-up">
            <span className="text-gray-900">Real People.</span>
            <br />
            <span className="gradient-text inline-block transition-all duration-500">
              {words[currentWord]}
            </span>{' '}
            <span className="text-gray-900">Connections.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Join thousands of verified singles finding meaningful relationships in a{' '}
            <span className="text-primary-600 font-semibold">safe, AI-moderated</span> environment.
            Your journey to love starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up animation-delay-400">
            <Link
              href="/auth/signup"
              className="btn-primary text-lg px-8 py-4 group"
            >
              Start Your Journey
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 animate-fade-in animation-delay-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                AI-Verified Profiles
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary-500 fill-primary-500" />
              <span className="text-sm font-medium text-gray-700">
                10K+ Success Stories
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-secondary-500" />
              <span className="text-sm font-medium text-gray-700">
                100K+ Active Users
              </span>
            </div>
          </div>

          {/* Hero Image Placeholder - Profile Cards Preview */}
          <div className="relative pt-12 pb-12 animate-scale-in animation-delay-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: 'Priya', age: 26, city: 'Mumbai', gradient: 'gradient-bg-1' },
                { name: 'Rahul', age: 28, city: 'Delhi', gradient: 'gradient-bg-2' },
                { name: 'Ananya', age: 25, city: 'Bangalore', gradient: 'gradient-bg-3' },
              ].map((profile, index) => (
                <div
                  key={index}
                  className="card-hover transform hover:rotate-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`${profile.gradient} h-48 rounded-xl mb-4 flex items-center justify-center text-white text-6xl font-bold`}>
                    {profile.name[0]}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-gray-600 text-sm">{profile.city}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="badge-success text-xs">✓ Verified</span>
                    <Heart className="w-5 h-5 text-gray-400 hover:text-primary-500 hover:fill-primary-500 cursor-pointer transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
