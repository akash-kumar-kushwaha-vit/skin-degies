import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiMicroscopeLine, RiFileTextLine, RiTimeLine,
  RiArrowRightLine, RiDeleteBin6Line, RiEyeLine
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card glass bg-gradient-to-r from-primary-950/60 to-slate-900/80 border-primary-500/20 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="badge-primary mb-2">SkinDegies AI Dashboard</span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">
            Hello, {user?.name}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Monitor your skin health trajectory, analyze new lesions with EfficientNetV2-S, and export structured medical reports.
          </p>
        </div>
        <Link to="/predict" className="btn-primary py-3.5 px-6 shadow-glow whitespace-nowrap">
          <RiMicroscopeLine className="w-5 h-5" /> New AI Analysis
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30 flex items-center justify-center">
            <RiMicroscopeLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Total Scans</p>
            <p className="font-display text-2xl font-bold text-white">{user?.totalPredictions || predictions.length}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-600/20 text-accent-400 border border-accent-500/30 flex items-center justify-center">
            <RiFileTextLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Medical Reports</p>
            <p className="font-display text-2xl font-bold text-white">{user?.totalReports || 0}</p>
          </div>
        </div>

        <div className="card glass flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <RiTimeLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Account Status</p>
            <p className="font-display text-lg font-bold text-emerald-400">Active Patient</p>
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="card glass space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-white">Recent AI Predictions</h3>
          {predictions.length > 0 && (
            <Link to="/predict" className="text-xs text-primary-400 hover:underline flex items-center gap-1">
              New Scan <RiArrowRightLine />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-12 skeleton" />
            <div className="h-12 skeleton" />
            <div className="h-12 skeleton" />
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <RiMicroscopeLine className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">No skin disease scans performed yet.</p>
            <Link to="/predict" className="btn-primary text-sm py-2 px-4 inline-flex">
              Run First Scan
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Primary Prediction</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {predictions.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {p.primaryDisease?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-primary">
                        {p.primaryConfidence?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {p.modelVersion}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        to={`/predictions/${p._id}`}
                        className="btn-ghost p-1.5 inline-flex text-slate-300 hover:text-primary-400"
                        title="View Report"
                      >
                        <RiEyeLine className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn-ghost p-1.5 inline-flex text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <RiDeleteBin6Line className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
