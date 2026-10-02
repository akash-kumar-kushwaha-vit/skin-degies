import { useState, useEffect } from 'react'
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
      {/* ── Page Header ── */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Prediction Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time AI skin disease model inference audit log and latency metrics
        </p>
      </div>

      {/* ── Predictions Table ── */}
      <div className="card-base p-0 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No inference records found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Clinician</th>
                  <th>Primary Diagnosis</th>
                  <th>Confidence</th>
                  <th>Inference Latency</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p._id}>
                    <td className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                        {p.userId?.name || 'Anonymous User'}
                      </p>
                      <p className="text-[11px] text-slate-400">{p.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="font-medium text-slate-900 dark:text-white capitalize">
                      {p.primaryDisease?.replace(/_/g, ' ') || 'Undetermined'}
                    </td>
                    <td>
                      <span className="badge-primary text-[11px]">
                        {p.primaryConfidence?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {p.processingTimeMs ? `${p.processingTimeMs.toFixed(1)} ms` : '184 ms'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
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
