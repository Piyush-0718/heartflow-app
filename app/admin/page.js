'use client'

import { useState } from 'react'
import { 
  Users, Flag, Shield, TrendingUp, MessageCircle, 
  AlertTriangle, CheckCircle, XCircle, Eye, Ban 
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Users', value: '102,456', change: '+12%', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Active Reports', value: '23', change: '-5%', icon: Flag, color: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Verified Profiles', value: '98,234', change: '+8%', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Daily Matches', value: '5,432', change: '+15%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ]

  const flaggedContent = [
    {
      id: 1,
      type: 'Profile',
      user: 'User #12345',
      reason: 'Inappropriate photo',
      reportedBy: 'User #67890',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      id: 2,
      type: 'Message',
      user: 'User #23456',
      reason: 'Harassment',
      reportedBy: 'User #78901',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      id: 3,
      type: 'Profile',
      user: 'User #34567',
      reason: 'Fake profile',
      reportedBy: 'User #89012',
      date: '2024-01-14',
      status: 'reviewing',
    },
  ]

  const recentUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com', joined: '2024-01-15', verified: true, status: 'active' },
    { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', joined: '2024-01-15', verified: true, status: 'active' },
    { id: 3, name: 'Ananya Patel', email: 'ananya@example.com', joined: '2024-01-14', verified: false, status: 'pending' },
  ]

  const handleResolveReport = (id, action) => {
    toast.success(`Report ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
  }

  const handleSuspendUser = (userId) => {
    toast.success('User suspended successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage users, content, and safety</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {['overview', 'reports', 'users'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New user registered', user: 'Priya Sharma', time: '5 minutes ago', icon: Users, color: 'text-blue-600' },
                      { action: 'Profile reported', user: 'User #12345', time: '15 minutes ago', icon: Flag, color: 'text-red-600' },
                      { action: 'Profile verified', user: 'Rahul Verma', time: '1 hour ago', icon: Shield, color: 'text-green-600' },
                      { action: 'New match created', user: 'Ananya & Vikram', time: '2 hours ago', icon: TrendingUp, color: 'text-purple-600' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center`}>
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Flagged Content</h3>
                  <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 outline-none">
                    <option>All Reports</option>
                    <option>Pending</option>
                    <option>Reviewing</option>
                    <option>Resolved</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {flaggedContent.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="badge-warning">{item.type}</span>
                            <span className={`badge ${
                              item.status === 'pending' ? 'badge-warning' :
                              item.status === 'reviewing' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.user}</h4>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Reason:</strong> {item.reason}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Reported by:</strong> {item.reportedBy} on {item.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleResolveReport(item.id, 'view')}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => handleResolveReport(item.id, 'approve')}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleResolveReport(item.id, 'reject')}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 outline-none"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold">
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                {user.verified && (
                                  <span className="text-xs text-green-600 flex items-center">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{user.email}</td>
                          <td className="py-4 px-4 text-gray-600">{user.joined}</td>
                          <td className="py-4 px-4">
                            <span className={`badge ${
                              user.status === 'active' ? 'badge-success' : 'badge-warning'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
