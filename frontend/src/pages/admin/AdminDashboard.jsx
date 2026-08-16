import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiUserSharedLine, RiMicroscopeLine, RiFileTextLine, RiMailUnreadLine, RiShieldKeyholeLine } from 'react-icons/ri'
import api from '../../services/api'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading command center statistics...</p>
      </div>
    )
  }

  const metrics = [
    { label: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: RiUserSharedLine, color: 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800/60' },
    { label: 'Total Predictions', value: stats?.stats?.totalPredictions || 0, icon: RiMicroscopeLine, color: 'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/60' },
    { label: 'Reports Generated', value: stats?.stats?.totalReports || 0, icon: RiFileTextLine, color: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60' },
    { label: 'Unread Inquiries', value: stats?.stats?.unreadContacts || 0, icon: RiMailUnreadLine, color: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <span className="badge-warning mb-2 inline-flex items-center gap-1">
          <RiShieldKeyholeLine className="w-3.5 h-3.5" /> Admin Command Center
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">Platform Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">System performance, users, and prediction frequency</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            variants={fadeUp} initial="hidden" animate="visible" custom={i}
            className="card-base p-5 flex items-center gap-4 hover:border-primary-400/40 dark:hover:border-primary-500/30 hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Predicted Diseases */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="card-base p-6 space-y-4 rounded-3xl"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Top Frequency Conditions</h3>
          <div className="space-y-2.5">
            {stats?.diseaseStats?.map((d) => (
              <div key={d._id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{d._id.replace(/_/g, ' ')}</span>
                <span className="badge-primary">{d.count} scans</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Registrations */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="card-base p-6 space-y-4 rounded-3xl"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recently Registered Users</h3>
          <div className="space-y-2.5">
            {stats?.recentUsers?.map((u) => (
              <div key={u._id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{u.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
