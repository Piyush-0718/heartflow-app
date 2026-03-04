'use client'

import { useEffect, useState } from 'react'
import { Heart, X, MapPin, Briefcase, Star, MessageCircle, Info, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const mockProfiles = [
  {
    id: 'mock-1',
    name: 'Priya Sharma',
    age: 26,
    location: 'Mumbai, Maharashtra',
    occupation: 'Product Designer',
    education: 'IIT Bombay',
    bio: 'Coffee enthusiast | Love exploring new cafes | Weekend hiker | Looking for someone to share adventures with',
    interests: ['Travel', 'Photography', 'Cooking', 'Yoga', 'Music'],
    photos: ['gradient-bg-1'],
    verified: true,
    compatibility: 92,
    prompts: [
      { question: 'My perfect weekend', answer: 'Hiking in the morning, brunch with friends, and Netflix in the evening' },
      { question: "I'm weirdly attracted to", answer: 'People who can make me laugh at the worst jokes' },
    ],
    gender: 'female',
    source: 'mock',
  },
  {
    id: 'mock-2',
    name: 'Rahul Verma',
    age: 28,
    location: 'Bangalore, Karnataka',
    occupation: 'Software Engineer',
    education: 'NIT Trichy',
    bio: 'Tech geek | Fitness freak | Foodie at heart | Believe in meaningful conversations over coffee',
    interests: ['Technology', 'Fitness', 'Travel', 'Reading', 'Gaming'],
    photos: ['gradient-bg-2'],
    verified: true,
    compatibility: 88,
    prompts: [
      { question: 'Two truths and a lie', answer: 'I can cook Italian food, I speak 3 languages, I hate dogs' },
      { question: 'My ideal date', answer: 'A quiet dinner followed by stargazing' },
    ],
    gender: 'male',
    source: 'mock',
  },
  {
    id: 'mock-3',
    name: 'Ananya Patel',
    age: 25,
    location: 'Delhi, NCR',
    occupation: 'Marketing Manager',
    education: 'Delhi University',
    bio: 'Creative soul | Dog mom | Loves indie music | Looking for genuine connections and deep conversations',
    interests: ['Art', 'Music', 'Pets', 'Fashion', 'Dancing'],
    photos: ['gradient-bg-3'],
    verified: true,
    compatibility: 85,
    prompts: [
      { question: 'I geek out on', answer: 'Vintage vinyl records and 90s Bollywood music' },
      { question: 'Green flag I look for', answer: 'Someone who respects boundaries and communicates openly' },
    ],
    gender: 'female',
    source: 'mock',
  },
]

function mapDbUserToProfile(user, index) {
  const primaryPhoto = user.photos?.find((p) => p.isPrimary)?.url || `gradient-bg-${(index % 3) + 1}`
  return {
    id: user._id,
    name: user.name || 'User',
    age: user.age || 18,
    location: `${user.location?.city || 'Unknown'}, ${user.location?.state || 'Unknown'}`,
    occupation: user.occupation || 'Not specified',
    education: user.education || 'Not specified',
    bio: user.bio || 'No bio yet.',
    interests: Array.isArray(user.interests) && user.interests.length > 0 ? user.interests : ['New here'],
    photos: [primaryPhoto],
    verified: !!user.verificationBadge,
    compatibility: 80 + (index % 20),
    prompts: [{ question: 'About me', answer: user.bio || 'Exploring meaningful connections.' }],
    source: 'db',
  }
}

export default function MatchesPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [profiles, setProfiles] = useState(mockProfiles)
  const [incomingRequests, setIncomingRequests] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    const loadPotentialMatches = async () => {
      try {
        const response = await fetch(`${apiBase}/api/matches/potential`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!response.ok || !Array.isArray(data)) return

        const dbProfiles = data.map(mapDbUserToProfile)
        const dedupedByName = dbProfiles.filter(
          (p) => !mockProfiles.some((m) => m.name.toLowerCase() === p.name.toLowerCase())
        )
        setProfiles([...mockProfiles, ...dedupedByName])
      } catch (error) {
        // Keep mock feed on network/API failure.
      }
    }

    const loadIncomingRequests = async () => {
      try {
        const response = await fetch(`${apiBase}/api/matches/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!response.ok || !Array.isArray(data)) return
        setIncomingRequests(data)
      } catch (error) {
        // Keep page usable when request API is unavailable.
      }
    }

    loadPotentialMatches()
    loadIncomingRequests()
  }, [apiBase])

  const currentProfile = profiles[currentIndex]

  const handleLike = () => {
    const token = localStorage.getItem('authToken')
    if (token && currentProfile?.source === 'db') {
      fetch(`${apiBase}/api/matches/like/${currentProfile.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    toast.success(`You liked ${currentProfile.name}!`, { icon: '❤' })
    nextProfile()
  }

  const handleSuperLike = () => {
    const token = localStorage.getItem('authToken')
    if (token && currentProfile?.source === 'db') {
      fetch(`${apiBase}/api/matches/super-like/${currentProfile.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    } else if (token && currentProfile?.source === 'mock') {
      fetch(`${apiBase}/api/matches/super-like-bot`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botKey: currentProfile.id,
          name: currentProfile.name,
          gender: currentProfile.gender || 'other',
          bio: currentProfile.bio,
        }),
      }).catch(() => {})
    }
    toast.success(`Super Like sent to ${currentProfile.name}!`, { icon: '⭐' })
    nextProfile()
  }

  const handleRespondRequest = async (matchId, action) => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    try {
      const response = await fetch(`${apiBase}/api/matches/requests/${matchId}/respond`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error || 'Failed to respond to request')
        return
      }
      setIncomingRequests((prev) => prev.filter((req) => req.matchId !== matchId))
      toast.success(action === 'accept' ? 'Request accepted. You can now chat.' : 'Request rejected.')
    } catch (error) {
      toast.error('Failed to respond to request')
    }
  }

  const handlePass = () => {
    nextProfile()
  }

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowDetails(false)
    } else {
      toast.success('No more profiles! Check back later for new matches.')
    }
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No More Profiles</h2>
          <p className="text-gray-600 mb-6">Check back later for new matches!</p>
          <Link href="/chat" className="btn-primary">
            View Your Matches
          </Link>
        </div>
      </div>
    )
  }

  const hasImagePhoto = currentProfile.photos[0]?.startsWith('http') || currentProfile.photos[0]?.startsWith('data:')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 py-8 px-4">
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
            <span className="text-2xl font-display font-bold gradient-text">HeartConnect</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/chat" className="relative">
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </Link>
            <Link href="/profile">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold">
                Y
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {incomingRequests.length > 0 && (
          <div className="card mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Incoming Requests</h3>
            <div className="space-y-3">
              {incomingRequests.slice(0, 3).map((req) => (
                <div key={req.matchId} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                  <div>
                    <p className="font-medium text-gray-900">{req.fromUser.name}{req.fromUser.age ? `, ${req.fromUser.age}` : ''}</p>
                    <p className="text-sm text-gray-600">{req.type === 'super_like' ? 'Sent you a Super Like' : 'Sent you a Like'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRespondRequest(req.matchId, 'reject')}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespondRequest(req.matchId, 'accept')}
                      className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card overflow-hidden relative" style={{ minHeight: '600px' }}>
          <div className={`${hasImagePhoto ? '' : currentProfile.photos[0]} h-96 relative rounded-xl mb-4 flex items-center justify-center text-white text-8xl font-bold overflow-hidden`}>
            {hasImagePhoto ? (
              <img src={currentProfile.photos[0]} alt={currentProfile.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              currentProfile.name[0]
            )}
            {currentProfile.verified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg">
                <Shield className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary-600 px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
              <Star className="w-4 h-4 fill-primary-500" />
              <span>{currentProfile.compatibility}% Match</span>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Info className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="flex items-center text-gray-600 mt-2 space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{currentProfile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{currentProfile.occupation}</span>
                </div>
              </div>
            </div>

            {!showDetails ? (
              <>
                <p className="text-gray-700 leading-relaxed">{currentProfile.bio}</p>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-primary-100 to-secondary-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-slide-down">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{currentProfile.bio}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-700">{currentProfile.education}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personality</h3>
                  <div className="space-y-3">
                    {currentProfile.prompts.map((prompt, index) => (
                      <div key={index} className="bg-gradient-to-r from-primary-50 to-secondary-50 p-3 rounded-xl">
                        <p className="text-sm font-medium text-gray-900 mb-1">{prompt.question}</p>
                        <p className="text-sm text-gray-700">{prompt.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6">
          <button
            onClick={handlePass}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group"
          >
            <X className="w-8 h-8 text-gray-600 group-hover:text-red-500 transition-colors" />
          </button>

          <button
            onClick={handleLike}
            className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-glow flex items-center justify-center hover:scale-110 transition-transform group"
          >
            <Heart className="w-10 h-10 text-white group-hover:fill-white transition-all" />
          </button>

          <button
            onClick={handleSuperLike}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group"
          >
            <Star className="w-8 h-8 text-secondary-500 group-hover:fill-secondary-500 transition-all" />
          </button>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">
          Profile {currentIndex + 1} of {profiles.length}
        </div>
      </div>
    </div>
  )
}
