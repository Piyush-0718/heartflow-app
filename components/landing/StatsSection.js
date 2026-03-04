'use client'

import { useEffect, useState, useRef } from 'react'
import { Heart, Users, MessageCircle, Award } from 'lucide-react'

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      icon: Users,
      value: '100K+',
      label: 'Active Users',
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      icon: Heart,
      value: '10K+',
      label: 'Success Stories',
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100',
    },
    {
      icon: MessageCircle,
      value: '1M+',
      label: 'Messages Daily',
      color: 'text-warm-500',
      bgColor: 'bg-warm-100',
    },
    {
      icon: Award,
      value: '98%',
      label: 'Verified Profiles',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <section ref={sectionRef} className="py-8 md:py-12 bg-white/50 backdrop-blur-sm">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transform transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
