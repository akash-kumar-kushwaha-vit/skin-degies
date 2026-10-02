import { useState, useEffect } from 'react'
import {
  RiUserSharedLine, RiMicroscopeLine, RiFileTextLine,
  RiMailUnreadLine, RiShieldKeyholeLine
} from 'react-icons/ri'
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
      <div className="flex flex-col items-center justify-center min-h-[360px] space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading command center analytics...</p>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Registered Users',
      value: stats?.stats?.totalUsers || 0,
      icon: RiUserSharedLine,
      color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Inferences',
      value: stats?.stats?.totalPredictions || 0,
      icon: RiMicroscopeLine,
      color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Clinical Reports',
      value: stats?.stats?.totalReports || 0,
      icon: RiFileTextLine,
      color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Unread Inquiries',
      value: stats?.stats?.unreadContacts || 0,
      icon: RiMailUnreadLine,
      color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Command Center
            </h1>
            <span className="badge-warning text-[10px]">Administrator</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Platform performance, user growth, and disease detection frequency
          </p>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-base p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {value}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Platform aggregated</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Analytics Breakdown Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Diagnosed Conditions */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Frequent Diagnostic Conditions
            </h3>
            <span className="text-xs text-slate-400 font-medium">Inference counts</span>
          </div>

          <div className="space-y-2.5">
            {stats?.diseaseStats && stats.diseaseStats.length > 0 ? (
              stats.diseaseStats.map((d) => (
                <div
                  key={d._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]"
                >
                  <span className="font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-200 capitalize">
                    {d._id.replace(/_/g, ' ')}
                  </span>
                  <span className="badge-primary text-xs font-mono">{d.count} scans</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No inference statistics available.</p>
            )}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Recently Joined Clinicians
            </h3>
            <span className="text-xs text-slate-400 font-medium">New accounts</span>
          </div>

          <div className="space-y-2.5">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]"
                >
                  <div>
                    <p className="font-medium text-xs sm:text-sm text-slate-900 dark:text-white">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No recent registrations.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
