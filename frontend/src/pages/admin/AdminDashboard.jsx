import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiUserSharedLine, RiMicroscopeLine, RiFileTextLine, RiMailUnreadLine } from 'react-icons/ri'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data.data)
    } catch (err) {
      toast.error('Failed to load admin statistics.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-primary mb-2">Admin Command Center</span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">Platform Analytics</h1>
        <p className="text-slate-400 text-sm">System performance, users, and prediction frequency</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30 flex items-center justify-center">
            <RiUserSharedLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Total Users</p>
            <p className="font-display text-2xl font-bold text-white">{stats?.stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-600/20 text-accent-400 border border-accent-500/30 flex items-center justify-center">
            <RiMicroscopeLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Total Predictions</p>
            <p className="font-display text-2xl font-bold text-white">{stats?.stats?.totalPredictions || 0}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <RiFileTextLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Reports Generated</p>
            <p className="font-display text-2xl font-bold text-white">{stats?.stats?.totalReports || 0}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <RiMailUnreadLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Unread Inquiries</p>
            <p className="font-display text-2xl font-bold text-white">{stats?.stats?.unreadContacts || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Predicted Diseases */}
        <div className="card glass space-y-4">
          <h3 className="font-display font-semibold text-lg text-white">Top Frequency Skin Conditions</h3>
          <div className="space-y-3">
            {stats?.diseaseStats?.map((d) => (
              <div key={d._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                <span className="font-medium text-slate-200">{d._id.replace(/_/g, ' ')}</span>
                <span className="badge-primary">{d.count} scans</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="card glass space-y-4">
          <h3 className="font-display font-semibold text-lg text-white">Recently Registered Users</h3>
          <div className="space-y-3">
            {stats?.recentUsers?.map((u) => (
              <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                <div>
                  <p className="font-medium text-slate-200 text-sm">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
