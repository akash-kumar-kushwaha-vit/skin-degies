import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  RiMicroscopeLine, RiFileTextLine, RiShieldCheckLine,
  RiArrowRightLine, RiDeleteBin6Line, RiEyeLine, RiAddLine,
  RiCpuLine, RiTimeLine
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/predictions?limit=6')
      setPredictions(data.data.predictions || [])
    } catch (err) {
      toast.error('Failed to load recent activity.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction record? This cannot be undone.')) return
    try {
      await api.delete(`/predictions/${id}`)
      setPredictions((prev) => prev.filter((p) => p._id !== id))
      toast.success('Scan record deleted.')
    } catch (err) {
      toast.error('Failed to delete scan.')
    }
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Clinician'

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header / Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Clinical trajectory, skin lesion diagnostic history, and patient reports.
          </p>
        </div>

        <Link
          to="/predict"
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm self-start sm:self-auto rounded-xl shadow-sm"
        >
          <RiAddLine className="w-4 h-4" />
          <span>New AI Scan</span>
        </Link>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="card-base p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Scans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RiMicroscopeLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {user?.totalPredictions ?? predictions.length}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Completed lesion inferences
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-base p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Clinical Reports</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <RiFileTextLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {user?.totalReports ?? 0}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Gemini diagnostic reports
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-base p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">System Model</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <RiCpuLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-base font-bold text-slate-900 dark:text-white truncate">
              EfficientNetV2-S
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              81.56% validation accuracy
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card-base p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Security & Status</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <RiShieldCheckLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
                Active & HIPAA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Encrypted end-to-end
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Predictions Section ── */}
      <div className="card-base p-0 overflow-hidden">
        {/* Section Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h2 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
              Recent AI Inferences
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Latest skin lesion analyses and confidence ratings
            </p>
          </div>
          <Link
            to="/predict"
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Scan New Image</span>
            <RiArrowRightLine className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Section Body */}
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-400 flex items-center justify-center mb-3">
              <RiMicroscopeLine className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
              No scans performed yet
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1 mb-5">
              Upload a dermatological image to receive automated classification, differential diagnosis, and Gemini reporting.
            </p>
            <Link to="/predict" className="btn-primary text-xs py-2 px-4 rounded-xl">
              <RiMicroscopeLine className="w-4 h-4" />
              <span>Start First Scan</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Prediction / Lesion</th>
                  <th>Confidence Score</th>
                  <th>Inference Model</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => {
                  const conf = p.primaryConfidence || 0
                  const isHigh = conf >= 85
                  return (
                    <tr key={p._id} className="group">
                      {/* Prediction Name */}
                      <td className="font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <span className="capitalize">
                            {p.primaryDisease?.replace(/_/g, ' ') || 'Undetermined'}
                          </span>
                        </div>
                      </td>

                      {/* Confidence Meter */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.08] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(conf, 100)}%` }}
                            />
                          </div>
                          <span
                            className={`badge ${
                              isHigh ? 'badge-success' : 'badge-primary'
                            } text-[11px]`}
                          >
                            {conf.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Model Version */}
                      <td className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {p.modelVersion || 'best_model.pth'}
                      </td>

                      {/* Date */}
                      <td className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/predictions/${p._id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            title="View clinical diagnosis & report"
                          >
                            <RiEyeLine className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            title="Delete scan"
                          >
                            <RiDeleteBin6Line className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
