import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'HeartConnect - Real People. Real Connections. Safe Conversations.',
  description: 'A premium dating platform that prioritizes safety, authenticity, and meaningful connections. Join thousands finding love in a secure, AI-moderated environment.',
  keywords: 'dating, relationships, safe dating, verified profiles, AI moderation, Indian dating',
  authors: [{ name: 'HeartConnect Team' }],
  openGraph: {
    title: 'HeartConnect - Find Your Perfect Match',
    description: 'Real People. Real Connections. Safe Conversations.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        {/* Floating Hearts Background */}
        <div className="floating-hearts" aria-hidden="true">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                fontSize: `${Math.random() * 20 + 15}px`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
