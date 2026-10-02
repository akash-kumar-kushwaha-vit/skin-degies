import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { RiArrowLeftLine, RiCalendarLine, RiMicroscopeLine } from 'react-icons/ri'
import PredictionResults from '../../components/predict/PredictionResults'
import ReportViewer from '../../components/predict/ReportViewer'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function PredictionDetailPage() {
  const { id } = useParams()
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrediction()
  }, [id])

  const fetchPrediction = async () => {
    try {
      const { data } = await api.get(`/predictions/${id}`)
      setPrediction(data.data.prediction)
    } catch (err) {
      toast.error('Failed to load prediction details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] space-y-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading clinical scan record...</p>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="card-base text-center py-12 rounded-2xl max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-400 flex items-center justify-center mx-auto">
          <RiMicroscopeLine className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Record Not Found</p>
          <p className="text-xs text-slate-400 mt-1">This diagnostic scan may have been deleted.</p>
        </div>
        <Link to="/dashboard" className="btn-secondary text-xs inline-flex items-center gap-1.5">
          <RiArrowLeftLine className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-white/[0.06]">
        <Link
          to="/dashboard"
          className="btn-secondary text-xs py-1.5 px-3 rounded-lg self-start flex items-center gap-1.5"
        >
          <RiArrowLeftLine className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RiCalendarLine className="w-3.5 h-3.5" />
          <span>
            Analyzed {new Date(prediction.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* ── Diagnostic Results ── */}
      <PredictionResults prediction={prediction} />

      {/* ── Report or Questionnaire Prompt ── */}
      {prediction.reportId ? (
        <ReportViewer report={prediction.reportId} />
      ) : (
        <div className="card-base text-center py-8 rounded-xl space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No clinical report was generated for this scan.
          </p>
          <Link to="/predict" className="btn-primary text-xs py-2 px-4 rounded-lg inline-flex items-center gap-1.5">
            <RiMicroscopeLine className="w-3.5 h-3.5" />
            <span>Run New Scan with Report</span>
          </Link>
        </div>
      )}
    </div>
  )
}
