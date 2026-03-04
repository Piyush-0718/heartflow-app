'use client'

import { Star, Heart, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya & Arjun',
      location: 'Mumbai',
      image: '💑',
      rating: 5,
      text: 'We matched on HeartConnect 6 months ago and it has been magical ever since. The verification process made us feel safe and the AI matching was spot-on!',
      story: 'Married in 2024',
    },
    {
      name: 'Sneha',
      location: 'Bangalore',
      image: '👩',
      rating: 5,
      text: 'As a woman, safety was my biggest concern. HeartConnect moderation and reporting features gave me the confidence to date online. Found my perfect match here!',
      story: 'In a relationship',
    },
    {
      name: 'Rohan & Meera',
      location: 'Delhi',
      image: '💏',
      rating: 5,
      text: 'The personality prompts helped us connect on a deeper level before even chatting. We bonded over our love for hiking and indie music. Thank you HeartConnect!',
      story: 'Engaged',
    },
    {
      name: 'Aditya',
      location: 'Pune',
      image: '👨',
      rating: 5,
      text: 'I was skeptical about dating apps but HeartConnect changed my mind. The quality of profiles and genuine people here is unmatched. Highly recommend!',
      story: 'Dating',
    },
    {
      name: 'Kavya & Vikram',
      location: 'Hyderabad',
      image: '💞',
      rating: 5,
      text: 'We appreciate how seriously HeartConnect takes privacy and safety. The encrypted chat and data controls made us feel secure throughout our journey.',
      story: 'Married in 2023',
    },
    {
      name: 'Ishaan',
      location: 'Chennai',
      image: '🧑',
      rating: 5,
      text: 'The AI matching algorithm is incredible! Every match I got was compatible with my interests and values. Found someone special within a month.',
      story: 'In a relationship',
    },
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
            <Heart className="w-5 h-5 text-primary-600 fill-primary-600" />
            <span className="text-sm font-semibold text-primary-800">
              Success Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Real People, Real <span className="gradient-text">Love Stories</span>
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of couples who found their perfect match on HeartConnect.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card-hover relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />

              {/* Profile */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-3xl">
                  {testimonial.image}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              {/* Story Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-1.5 rounded-full">
                <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />
                <span className="text-sm font-medium text-gray-700">
                  {testimonial.story}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-600 mb-6">
            Ready to write your own success story?
          </p>
          <a href="/auth/signup" className="btn-primary text-lg px-8 py-4">
            Join HeartConnect Today
          </a>
        </div>
      </div>
    </section>
  )
}
