'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, Clock, FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export default function GrievanceRedressal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Grievance Redressal Mechanism</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to addressing your concerns promptly and professionally. Your feedback helps us improve our services.
          </p>
        </div>
        
        {/* Grievance Officer Contact */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Contact Grievance Officer</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                <a href="mailto:grievance@heartconnect.com" className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  grievance@heartconnect.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Response Time</p>
                <p className="text-lg font-semibold text-gray-900">24-36 hours</p>
                <p className="text-sm text-gray-600 mt-1">Resolution within 15 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to File */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to File a Grievance</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Compose Your Email', desc: 'Send a detailed email to grievance@heartconnect.com' },
              { step: '2', title: 'Provide Details', desc: 'Include your registered email, account details, and a clear description of the issue' },
              { step: '3', title: 'Attach Evidence', desc: 'Include relevant screenshots, documents, or other supporting materials' },
              { step: '4', title: 'Acknowledgment', desc: 'Receive confirmation of receipt within 24 hours' },
              { step: '5', title: 'Resolution', desc: 'Get a response and resolution within 15 working days' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Can Help With */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Issues We Address</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: AlertCircle, title: 'Account Suspension Appeals', desc: 'Challenge account restrictions or bans' },
              { icon: Shield, title: 'Privacy Concerns', desc: 'Data privacy and security issues' },
              { icon: FileText, title: 'Content Removal Requests', desc: 'Request removal of inappropriate content' },
              { icon: AlertCircle, title: 'Harassment Complaints', desc: 'Report abusive or harassing behavior' },
              { icon: CheckCircle, title: 'Data Access Requests', desc: 'Request access to your personal data' },
              { icon: FileText, title: 'Account Deletion', desc: 'Permanent account and data deletion' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-all">
                <item.icon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>All grievances are handled with strict confidentiality</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>You will receive regular updates on the status of your complaint</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>For urgent safety concerns, contact local authorities immediately</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
