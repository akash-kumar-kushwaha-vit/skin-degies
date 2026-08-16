import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiMicroscopeLine, RiFileTextLine, RiTimeLine,
  RiArrowRightLine, RiDeleteBin6Line, RiEyeLine, RiSparklingLine,
  RiShieldCheckLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

const RISK_COLORS = {
  Low:      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/50',
  Moderate: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50',
  High:     'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800/50',
  Critical: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/50',
}

export default function DashboardPage() {
  const { user }         = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/predictions?limit=5')
      setPredictions(data.data.predictions)
    } catch (err) {
      toast.error('Failed to load recent activity.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction history item?')) return
    try {
      await api.delete(`/predictions/${id}`)
      setPredictions((prev) => prev.filter((p) => p._id !== id))
      toast.success('Prediction deleted.')
    } catch (err) {
      toast.error('Failed to delete prediction.')
    }
  }

  return (
    <div className="space-y-7">

      {/* ── Welcome Banner ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        className="relative overflow-hidden rounded-3xl border border-primary-500/20 shadow-premium p-7 md:p-9 text-white"
        style={{ background: 'linear-gradient(135deg, #0f1f4a 0%, #0d1940 35%, #091530 65%, #081024 100%)' }}
      >
        {/* Glows */}
        <div className="absolute top-0 right-0 w-[380px] h-[260px] bg-primary-500/18 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-teal-500/12 rounded-full blur-[70px] pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-400/25 text-primary-200 text-[10px] font-bold uppercase tracking-[0.16em] mb-4">
              <RiSparklingLine className="w-3 h-3 text-primary-300" /> SkinDegies AI Workspace
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300/80 text-sm mt-2 max-w-xl leading-relaxed">
              Monitor your skin health trajectory, analyze new lesions with EfficientNetV2-S, and export structured medical reports.
            </p>
          </div>
          <Link
            to="/predict"
            className="btn-primary py-3.5 px-7 whitespace-nowrap shadow-button hover:shadow-button-hover flex-shrink-0 rounded-2xl text-sm"
          >
            <RiMicroscopeLine className="w-4 h-4" /> New AI Scan
          </Link>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            icon: RiMicroscopeLine,
            label: 'Total Scans',
            value: user?.totalPredictions ?? predictions.length,
            iconBg: 'bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 border-primary-200/80 dark:border-primary-800/50',
            accent: 'border-l-primary-500',
            custom: 0,
          },
          {
            icon: RiFileTextLine,
            label: 'Medical Reports',
            value: user?.totalReports ?? 0,
            iconBg: 'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/50',
            accent: 'border-l-teal-500',
            custom: 1,
          },
          {
            icon: RiTimeLine,
            label: 'Account Status',
            value: 'Active',
            isStatus: true,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/50',
            accent: 'border-l-emerald-500',
            custom: 2,
          },
        ].map(({ icon: Icon, label, value, iconBg, isStatus, accent, custom }) => (
          <motion.div
            key={label}
            variants={fadeUp} initial="hidden" animate="visible" custom={custom}
            className={`card-base p-5 flex items-center gap-4 hover:border-slate-300/60 dark:hover:border-slate-700/60 hover:shadow-lg transition-all duration-300 border-l-4 ${accent}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">{label}</p>
              <p className={`font-display font-extrabold mt-0.5 ${isStatus ? 'text-emerald-600 dark:text-emerald-400 text-base' : 'text-slate-900 dark:text-white text-2xl'}`}>
                {value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Recent Predictions ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={3}
        className="card-base p-0 rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">Recent AI Predictions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your latest skin lesion scans and diagnostic outcomes</p>
          </div>
          {predictions.length > 0 && (
            <Link to="/predict" className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold transition-colors">
              New Scan <RiArrowRightLine className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-2xl" />
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/80 border border-primary-200/70 dark:border-primary-800/50 flex items-center justify-center text-primary-500 dark:text-primary-400">
              <RiMicroscopeLine className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-base mb-1">No scans performed yet</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
                Upload your first skin lesion image to run AI classification & report generation.
              </p>
            </div>
            <Link to="/predict" className="btn-primary text-xs py-2.5 px-5 rounded-xl mt-2">
              <RiMicroscopeLine className="w-4 h-4" /> Run First Scan
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-4 space-y-2">
            {predictions.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="prediction-row group"
              >
                {/* Date */}
                <div className="hidden sm:flex flex-col min-w-[80px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Disease name */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Prediction</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {p.primaryDisease?.replace(/_/g, ' ')}
                  </p>
                </div>

                {/* Confidence badge */}
                <div className="flex-shrink-0">
                  <span className="badge-primary text-xs font-bold">
                    {p.primaryConfidence?.toFixed(1)}%
                  </span>
                </div>

                {/* Model version — hidden on small */}
                <div className="hidden md:flex flex-col min-w-[90px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Model</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.modelVersion}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    to={`/predictions/${p._id}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-all"
                    title="View Report"
                  >
                    <RiEyeLine className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                    title="Delete"
                  >
                    <RiDeleteBin6Line className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer link */}
        {predictions.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60">
            <Link to="/predict" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
              <RiShieldCheckLine className="w-3.5 h-3.5" />
              All data is encrypted and HIPAA-aligned
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
