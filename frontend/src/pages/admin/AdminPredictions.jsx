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
        <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">System Prediction Logs</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">System-wide AI skin disease model inference records</p>
      </div>

      <div className="card-base p-0 rounded-3xl overflow-hidden shadow-premium">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-base">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Primary Diagnosis</th>
                  <th>Confidence</th>
                  <th>Processing Latency</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <p className="font-semibold text-slate-900 dark:text-white">{p.userId?.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.userId?.email}</p>
                    </td>
                    <td className="font-semibold text-primary-600 dark:text-primary-400">
                      {p.primaryDisease?.replace(/_/g, ' ')}
                    </td>
                    <td>
                      <span className="badge-primary">{p.primaryConfidence?.toFixed(1)}%</span>
                    </td>
                    <td className="text-xs text-slate-500 dark:text-slate-400">
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
          <div className="flex items-center justify-between p-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary py-1.5 px-3.5 text-xs rounded-xl"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary py-1.5 px-3.5 text-xs rounded-xl"
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
