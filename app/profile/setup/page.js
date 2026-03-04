'use client'

import { useState } from 'react'
import { Camera, Upload, MapPin, Briefcase, GraduationCap, Heart, X, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProfileSetupPage() {
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState([])
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    occupation: '',
    education: '',
    interests: [],
    lookingFor: '',
    prompts: {
      prompt1: { question: 'Two truths and a lie', answer: '' },
      prompt2: { question: 'My perfect weekend looks like', answer: '' },
      prompt3: { question: 'I am weirdly attracted to', answer: '' },
    }
  })

  const interestOptions = [
    'Travel', 'Music', 'Movies', 'Reading', 'Cooking', 'Fitness',
    'Photography', 'Art', 'Gaming', 'Sports', 'Dancing', 'Yoga',
    'Hiking', 'Foodie', 'Fashion', 'Technology', 'Pets', 'Volunteering'
  ]

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (photos.length + files.length > 6) {
      toast.error('Maximum 6 photos allowed')
      return
    }
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const toggleInterest = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = () => {
    if (photos.length < 2) {
      toast.error('Please upload at least 2 photos')
      return
    }
    if (!profileData.bio || profileData.bio.length < 50) {
      toast.error('Bio must be at least 50 characters')
      return
    }
    if (profileData.interests.length < 3) {
      toast.error('Please select at least 3 interests')
      return
    }

    toast.success('Profile created! Redirecting to matches...')
    setTimeout(() => {
      window.location.href = '/matches'
    }, 2000)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Complete Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-xl text-gray-600">
            Let's help you find your perfect match
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm font-medium text-primary-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Photos */}
        {step === 1 && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your Photos</h2>
            <p className="text-gray-600 mb-6">Upload 2-6 photos that show your personality</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      Primary
                    </div>
                  )}
                </div>
              ))}

              {photos.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={photos.length < 2}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Basic Info & Bio */}
        {step === 2 && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Yourself</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio <span className="text-gray-500">(50-500 characters)</span>
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  maxLength="500"
                  className="input-field resize-none"
                  placeholder="Tell people about yourself, your interests, what makes you unique..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {profileData.bio.length}/500
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="input-field"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="input-field"
                    placeholder="Your job title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="inline w-4 h-4 mr-1" />
                  Education
                </label>
                <input
                  type="text"
                  value={profileData.education}
                  onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                  className="input-field"
                  placeholder="Your highest education"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Looking For
                </label>
                <select
                  value={profileData.lookingFor}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lookingFor: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select...</option>
                  <option value="relationship">Long-term Relationship</option>
                  <option value="dating">Casual Dating</option>
                  <option value="friendship">Friendship</option>
                  <option value="open">Open to Anything</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests & Prompts */}
        {step === 3 && (
          <div className="card animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Interests & Personality</h2>

            <div className="space-y-8">
              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Interests <span className="text-gray-500">(Choose at least 3)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        profileData.interests.includes(interest)
                          ? 'bg-primary-500 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality Prompts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Personality Prompts
                </label>
                <div className="space-y-4">
                  {Object.entries(profileData.prompts).map(([key, prompt]) => (
                    <div key={key} className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl">
                      <p className="font-medium text-gray-900 mb-2">{prompt.question}</p>
                      <input
                        type="text"
                        value={prompt.answer}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          prompts: {
                            ...prev.prompts,
                            [key]: { ...prompt, answer: e.target.value }
                          }
                        }))}
                        className="input-field"
                        placeholder="Your answer..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                  Back
                </button>
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
