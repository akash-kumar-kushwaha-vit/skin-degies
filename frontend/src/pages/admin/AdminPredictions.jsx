import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPredictions()
  }, [page])

  const fetchPredictions = async () => {
    try {
      const { data } = await api.get(`/admin/predictions?page=${page}`)
      setPredictions(data.data.predictions)
      setTotalPages(data.data.pagination.totalPages)
    } catch (err) {
      toast.error('Failed to load system predictions log.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">System Prediction Logs</h1>
        <p className="text-slate-400 text-sm">System-wide AI skin disease model inference records</p>
      </div>

      <div className="card glass">
        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-12 skeleton" />
            <div className="h-12 skeleton" />
            <div className="h-12 skeleton" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Primary Diagnosis</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Processing Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {predictions.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{p.userId?.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-400">{p.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary-300">
                      {p.primaryDisease?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-primary">{p.primaryConfidence?.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {p.processingTimeMs ? `${p.processingTimeMs.toFixed(1)} ms` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-ghost py-1 px-3"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-ghost py-1 px-3"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
