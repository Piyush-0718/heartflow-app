'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, Shield, Users, Sparkles, CheckCircle, Lock, 
  MessageCircle, Award, TrendingUp, Star, ArrowRight,
  UserCheck, Bell, Eye, Zap, Globe, Phone
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import SafetySection from '@/components/landing/SafetySection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import StatsSection from '@/components/landing/StatsSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar isScrolled={isScrolled} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <SafetySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
